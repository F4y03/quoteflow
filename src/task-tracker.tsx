 'use client'
import { useEffect, useRef, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'

type Status = 'todo' | 'progress' | 'done'
type Task = { id: number; title: string; project: string; due: number; status: Status }
type View = 'board' | 'planner' | 'notes'
type DailyUpdate = { completed: Task[]; todo: Task[]; progress: Task[]; blockers: string; tomorrow: string; savedAt: string }
const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const currentDate = new Date()
const currentDay = currentDate.getDate()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear() + 543

const seed: Task[] = [
	{ id: 1, title: 'สรุป requirement จากทีมขาย', project: 'Customer Portal', due: 18, status: 'todo' },
	{ id: 2, title: 'ติดตามผล UAT รอบที่ 1', project: 'ERP Upgrade', due: 19, status: 'progress' },
	{ id: 3, title: 'ตรวจสอบสิทธิ์เข้าถึงระบบ', project: 'Security Review', due: 23, status: 'progress' },
	{ id: 4, title: 'ส่งรายงานสถานะรายสัปดาห์', project: 'Customer Portal', due: 16, status: 'done' },
]
const columns: { key: Status; title: string }[] = [{ key: 'todo', title: 'ต้องทำ' }, { key: 'progress', title: 'กำลังทำ' }, { key: 'done', title: 'เสร็จแล้ว' }]

export default function TaskTracker({ onHome, darkMode, onToggleTheme }: { onHome: () => void; darkMode: boolean; onToggleTheme: () => void }) {
	const [tasks, setTasks] = useState(seed)
	const [view, setView] = useState<View>('board')
	const [show, setShow] = useState(false)
	const [text, setText] = useState('')
	const [day, setDay] = useState(1)
	const [month, setMonth] = useState(0)
	const [year, setYear] = useState(currentYear)
	const [dateReady, setDateReady] = useState(false)
	const [blockers, setBlockers] = useState('')
	const [tomorrow, setTomorrow] = useState('')
	const [dailyUpdates, setDailyUpdates] = useState<Record<string, DailyUpdate>>({})
	const [saved, setSaved] = useState(false)
	useEffect(() => {
		const today = new Date()
		setDay(today.getDate())
		setMonth(today.getMonth())
		setYear(today.getFullYear() + 543)
		setDateReady(true)
	}, [])
	useEffect(() => {
		const raw = localStorage.getItem('work-hub-daily-updates')
		if (raw) {
			try { setDailyUpdates(JSON.parse(raw) as Record<string, DailyUpdate>) } catch { setDailyUpdates({}) }
		}
	}, [])
	useEffect(() => { localStorage.setItem('work-hub-daily-updates', JSON.stringify(dailyUpdates)) }, [dailyUpdates])
	useEffect(() => {
		const update = dailyUpdates[`${year}-${month}-${day}`]
		setBlockers(update?.blockers ?? '')
		setTomorrow(update?.tomorrow ?? '')
		setSaved(Boolean(update))
	}, [dailyUpdates, day, month, year])
	const dateKey = `${year}-${month}-${day}`
	const daysInMonth = new Date(year - 543, month + 1, 0).getDate()
	const add = () => {
		if (text.trim()) {
			setTasks(current => [{ id: Date.now(), title: text, project: 'General', due: day, status: 'todo' }, ...current])
			setShow(false)
			setText('')
		}
	}
	const completedToday = tasks.filter(task => task.status === 'done')
	const todoTasks = tasks.filter(task => task.status === 'todo')
	const progressTasks = tasks.filter(task => task.status === 'progress')
	const saveDailyUpdate = () => {
		setDailyUpdates(current => ({ ...current, [dateKey]: { completed: completedToday, todo: todoTasks, progress: progressTasks, blockers, tomorrow, savedAt: new Date().toISOString() } }))
		setSaved(true)
	}
	return <div className="simple-tracker">
		<header className="simple-top"><button onClick={onHome}><span>✓</span>Work Hub</button><nav><button onClick={onHome}>ภาพรวม</button>{(['board', 'planner', 'notes'] as View[]).map(item => <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item)}>{item === 'board' ? 'งาน' : item === 'planner' ? 'ปฏิทิน + Daily Update' : 'Meeting Notes'}</button>)}</nav><div className="simple-actions"><button className="theme-toggle" onClick={onToggleTheme} aria-label={darkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}>{darkMode ? '☀' : '☾'}</button></div></header>
		<main className="simple-main"><section className="simple-head"><div><span>WORK HUB</span><h1>{view === 'planner' ? 'ปฏิทิน + Daily Work Update' : view === 'notes' ? 'Meeting Notes' : 'งานของคุณ'}</h1><p>{view === 'board' ? 'จัดการงานและสถานะจากที่เดียว' : view === 'planner' ? `เลือกวันที่เพื่อดูงานและบันทึก Daily Update · ${day} ${thaiMonths[month]} ${year}` : 'สรุปประเด็นสำคัญและ action items'}</p></div><div className="simple-head-actions"><div className="simple-summary"><b>{tasks.filter(task => task.status !== 'done').length}</b><span>งานที่กำลังเปิด</span></div></div></section>{view === 'board' ? <Board tasks={tasks} setTasks={setTasks} onAddTask={() => setShow(true)} /> : view === 'planner' ? <section className="planner-view"><Calendar tasks={tasks} day={day} month={month} year={year} daysInMonth={daysInMonth} setDay={setDay} setMonth={setMonth} setYear={setYear} dailyUpdates={dailyUpdates} /><DailyView date={dateReady ? `${day} ${thaiMonths[month]} ${year}` : 'กำลังโหลดวันที่ปัจจุบัน...'} completed={completedToday} todo={todoTasks} progress={progressTasks} blockers={blockers} setBlockers={setBlockers} tomorrow={tomorrow} setTomorrow={setTomorrow} saved={saved} onSave={saveDailyUpdate} /></section> : <Notes />}</main>
		{show && <div className="simple-modal-bg"><form className="simple-modal" onSubmit={event => { event.preventDefault(); add() }}><button type="button" onClick={() => setShow(false)}>×</button><span>NEW TASK</span><h2>สร้างงานใหม่</h2><input autoFocus value={text} onChange={event => setText(event.target.value)} placeholder="ชื่องาน"/><label>กำหนดส่ง<select value={day} onChange={event => setDay(+event.target.value)}>{[18, 19, 20, 21, 22, 23].map(number => <option key={number}>{number}</option>)}</select></label><footer><button type="button" onClick={() => setShow(false)}>ยกเลิก</button><button>บันทึกงาน</button></footer></form></div>}
	</div>
}

function Board({ tasks, setTasks, onAddTask }: { tasks: Task[]; setTasks: Dispatch<SetStateAction<Task[]>>; onAddTask: () => void }) { return <section className="board-view"><div className="board-toolbar"><div><span>สถานะงาน</span><p>อัปเดตงานจากการ์ดแต่ละรายการ</p></div><button className="board-add-task" onClick={onAddTask}><span>+</span> สร้างงาน</button></div><div className="simple-board">{columns.map(column => <div className="simple-col" key={column.key}><h2>{column.title}<span>{tasks.filter(task => task.status === column.key).length}</span></h2>{tasks.filter(task => task.status === column.key).map(task => <article key={task.id}><small>{task.project} · {task.due} ส.ค.</small><b>{task.title}</b><div>{columns.map(option => <button key={option.key} className={task.status === option.key ? 'selected' : ''} onClick={() => setTasks(current => current.map(item => item.id === task.id ? { ...item, status: option.key } : item))}>{option.title}</button>)}</div></article>)}</div>)}</div></section> }
function DailyView({ date, completed, todo, progress, blockers, setBlockers, tomorrow, setTomorrow, saved, onSave }: { date: string; completed: Task[]; todo: Task[]; progress: Task[]; blockers: string; setBlockers: (value: string) => void; tomorrow: string; setTomorrow: (value: string) => void; saved: boolean; onSave: () => void }) { return <section className="hub-daily"><div className="hub-daily-intro"><div><span>DAILY CHECK-IN · {date}</span><h2>สรุปงานของวันนี้</h2><p>บันทึกนี้จะอยู่ในปฏิทินเพื่อเปิดดูย้อนหลัง</p></div><div className="hub-daily-count"><b>{completed.length}</b><span>งานเสร็จวันนี้</span></div></div><div className="hub-daily-grid"><article><span>✓ งานที่เสร็จวันนี้</span>{completed.length ? completed.map(task => <p key={task.id}><b>✓</b>{task.title}<small>{task.project}</small></p>) : <em>ยังไม่มีงานที่เสร็จวันนี้</em>}</article><article><span>○ งานที่ยังไม่ได้ทำ</span>{todo.length ? todo.map(task => <p key={task.id}><b>○</b>{task.title}<small>{task.project} · ครบกำหนด {task.due} ส.ค.</small></p>) : <em>ไม่มีงานที่ยังไม่ได้ทำ</em>}</article><article><span>◷ งานที่กำลังทำ</span>{progress.length ? progress.map(task => <p key={task.id}><b>→</b>{task.title}<small>{task.project} · ครบกำหนด {task.due} ส.ค.</small></p>) : <em>ไม่มีงานที่กำลังทำ</em>}</article><label><span>! อุปสรรค / สิ่งที่ต้องการความช่วยเหลือ</span><textarea value={blockers} onChange={event => setBlockers(event.target.value)} placeholder="เช่น รอสิทธิ์เข้าถึงระบบจากทีม IT" /></label><label><span>→ เป้าหมายวันถัดไป</span><textarea value={tomorrow} onChange={event => setTomorrow(event.target.value)} placeholder="เช่น ปิดรายการแก้ไขก่อน 15:00" /></label></div><footer className="hub-daily-footer"><span>{saved ? '✓ บันทึก Daily Update แล้ว' : 'ยังไม่ได้บันทึก'}</span><button onClick={onSave}>บันทึก Daily Update →</button></footer></section> }
function Calendar({tasks,day,month,year,daysInMonth,setDay,setMonth,setYear,dailyUpdates}:{tasks:Task[];day:number;month:number;year:number;daysInMonth:number;setDay:(n:number)=>void;setMonth:(n:number)=>void;setYear:(n:number)=>void;dailyUpdates:Record<string, DailyUpdate>}){const dayKey=`${year}-${month}-${day}`;const update=dailyUpdates[dayKey];const [showSaved,setShowSaved]=useState(false);const savedCompleted=update?.completed ?? tasks.filter(t=>t.status==='done');const savedTodo=update?.todo ?? tasks.filter(t=>t.status==='todo');const savedProgress=update?.progress ?? tasks.filter(t=>t.status==='progress');const savedList=(items:Task[], icon:string, empty:string)=><div className="saved-task-group"><b>{icon} {items.length ? `${items.length} รายการ` : empty}</b>{items.slice(0,3).map(task=><p key={task.id}>{task.title}<small>{task.project} · ครบกำหนด {task.due} ส.ค.</small></p>)}{items.length>3&&<small>และอีก {items.length-3} รายการ</small>}</div>;const years=[currentYear-1,currentYear,currentYear+1,currentYear+2];return <section className="calendar-layout"><div className="calendar-card"><header><div className="calendar-selectors"><select value={day} onChange={event=>{setDay(+event.target.value);setShowSaved(false)}} aria-label="เลือกวัน">{Array.from({length:daysInMonth},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}</option>)}</select><select value={month} onChange={event=>{setMonth(+event.target.value);setDay(1);setShowSaved(false)}} aria-label="เลือกเดือน">{thaiMonths.map((name,index)=><option key={name} value={index}>{name}</option>)}</select><select value={year} onChange={event=>{setYear(+event.target.value);setDay(1);setShowSaved(false)}} aria-label="เลือกปี">{years.map(value=><option key={value} value={value}>{value}</option>)}</select></div><span>งาน + Daily Update</span></header><div className="week">{['จ','อ','พ','พฤ','ศ','ส','อา'].map(x=><b key={x}>{x}</b>)}{Array.from({length:daysInMonth},(_,i)=>i+1).map(n=><button key={n} onClick={()=>{setDay(n);setShowSaved(false)}} className={day===n?'today':''}>{n}{dailyUpdates[`${year}-${month}-${n}`]&&<i/>}</button>)}</div></div><aside className="day-tasks"><span>{day} {thaiMonths[month]} {year}</span><h2>รายการของวัน</h2>{update ? <><button className="saved-update-button" aria-expanded={showSaved} onClick={()=>setShowSaved(value=>!value)}>{showSaved ? 'ซ่อนรายการที่บันทึก' : 'ดูรายการที่บันทึกแล้ว'} <span>{showSaved ? '↑' : '↓'}</span></button>{showSaved && <section className="calendar-update-preview"><small className="calendar-saved-note">Daily Update ที่บันทึกไว้</small>{savedList(savedCompleted,'✓','ไม่มีงานที่เสร็จแล้ว')}{savedList(savedTodo,'○','ไม่มีงานที่ยังไม่ได้ทำ')}{savedList(savedProgress,'→','ไม่มีงานที่กำลังทำ')}<p><b>อุปสรรค</b>{update.blockers || 'ไม่ได้ระบุ'}</p><p><b>เป้าหมายวันถัดไป</b>{update.tomorrow || 'ไม่ได้ระบุ'}</p></section>}</> : <><h3>งานตามกำหนด</h3>{tasks.filter(t=>t.due===day).map(t=><article key={t.id}><small>{t.project}</small><b>{t.title}</b></article>)}</>}</aside></section>}
function Notes(){
	const meetings = [{ name: 'Weekly Operations Sync', time: '15:00', label: 'วันนี้' }, { name: 'Team Standup', time: '16:30', label: 'วันนี้' }, { name: 'ERP UAT Review', time: '10:00', label: 'พรุ่งนี้' }]
	const defaultActionItems = ['สรุป requirement ของ Customer Portal', 'ตรวจสอบสิทธิ์ก่อนเปิด UAT']
	const [now, setNow] = useState(() => new Date())
	const [notificationEnabled, setNotificationEnabled] = useState(false)
	const [actionItems, setActionItems] = useState(defaultActionItems)
	const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})
	const [newActionItem, setNewActionItem] = useState('')
	const [showActionInput, setShowActionInput] = useState(false)
	const notifiedMeetings = useRef(new Set<string>())
	useEffect(() => {
		const raw = localStorage.getItem('work-hub-meeting-notes')
		if (!raw) return
		try {
			const stored = JSON.parse(raw) as { actionItems?: string[]; completedItems?: Record<string, boolean> }
			if (stored.actionItems) setActionItems(stored.actionItems)
			if (stored.completedItems) setCompletedItems(stored.completedItems)
		} catch { setActionItems(defaultActionItems) }
	}, [])
	useEffect(() => { localStorage.setItem('work-hub-meeting-notes', JSON.stringify({ actionItems, completedItems })) }, [actionItems, completedItems])
	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 30000)
		return () => window.clearInterval(timer)
	}, [])
	useEffect(() => {
		if ('Notification' in window && Notification.permission === 'granted') setNotificationEnabled(true)
	}, [])
	const todayMinutes = now.getHours() * 60 + now.getMinutes()
	const reminders = meetings.filter(meeting => meeting.label === 'วันนี้').filter(meeting => {
		const [hours, minutes] = meeting.time.split(':').map(Number)
		const difference = hours * 60 + minutes - todayMinutes
		return difference > 0 && difference <= 30
	})
	useEffect(() => {
		if (!notificationEnabled || !reminders.length) return
		reminders.forEach(meeting => {
			const key = `${now.toDateString()}-${meeting.name}`
			if (notifiedMeetings.current.has(key)) return
			new Notification('ใกล้ถึงเวลาประชุม', { body: `${meeting.name} เวลา ${meeting.time} จะเริ่มภายใน 30 นาที` })
			notifiedMeetings.current.add(key)
		})
	}, [notificationEnabled, reminders, now])
	const enableNotifications = async () => {
		if (!('Notification' in window)) return
		const permission = await Notification.requestPermission()
		setNotificationEnabled(permission === 'granted')
	}
	const addActionItem = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const item = newActionItem.trim()
		if (!item) return
		setActionItems(current => [...current, item])
		setNewActionItem('')
		setShowActionInput(false)
	}
	return <section className="notes-simple">
		{reminders.length > 0 && <div className="meeting-reminder" role="status" aria-live="polite"><b>แจ้งเตือนการประชุม</b><span>{reminders.map(meeting => `${meeting.name} เวลา ${meeting.time}`).join(' · ')} จะเริ่มภายใน 30 นาที</span></div>}
		<article><span>MEETING NOTES</span><h2>Weekly Operations Sync</h2><p>วันนี้ · 15:00–15:45</p><hr/>{actionItems.map(item => <label key={item}><input type="checkbox" checked={Boolean(completedItems[item])} onChange={event => setCompletedItems(current => ({ ...current, [item]: event.target.checked }))}/> {item}</label>)}{showActionInput ? <form className="action-item-form" onSubmit={addActionItem}><input autoFocus value={newActionItem} onChange={event => setNewActionItem(event.target.value)} placeholder="เพิ่ม action item"/><button type="submit">เพิ่ม</button><button type="button" onClick={() => setShowActionInput(false)}>ยกเลิก</button></form> : <button onClick={() => setShowActionInput(true)}>＋ เพิ่ม Action Item</button>}</article>
		<article><span>UPCOMING</span><h2>การประชุมถัดไป</h2>{meetings.slice(1).map(meeting => <p key={meeting.name}><b>{meeting.name}</b><br/>{meeting.label} · {meeting.time}</p>)}<button className="notification-permission" onClick={enableNotifications}>{notificationEnabled ? 'เปิดการแจ้งเตือนแล้ว' : 'เปิดการแจ้งเตือนบนเบราว์เซอร์'}</button></article>
	</section>
}
