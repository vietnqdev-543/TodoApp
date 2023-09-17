


import { useState, useEffect } from "react";
import { db } from "../Auth/Config";
import { collection, addDoc, doc, query, where, getDocs, updateDoc, deleteDoc, } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Todolist.scss";
import { Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // thư viện thông báo react
import 'react-toastify/dist/ReactToastify.css';


export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]); // Danh sách công việc
  const [note, setNote] = useState(""); //tiêu đề công việc
  const [value, setValue] = useState(""); // Nội dung công việc
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày và giờ
  const [editingId, setEditingId] = useState(null);
  const [totalwork, setTotalWorks] = useState(0) // trạng thái của tổng các công việc

  // chức năng tìm kiếm
  const [searchValue, setSearchValue] = useState(""); // Trạng thái của thanh tìm kiếm
  const [displaySearchText, setDisplaySearchText] = useState(false); // Trạng thái để hiển thị chữ
  const [originalTodos, setOriginalTodos] = useState([]); // Khai báo danh sách gốc

  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupNote, setPopupNote] = useState(""); // State to store the note content


  useEffect(() => {
    if (user) {
      fetchTodos(); // Gọi hàm để lấy danh sách công việc

    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;

    const todosCollection = collection(db, "todos");
    const userQuery = query(todosCollection, where("user", "==", user));
    const todosSnapshot = await getDocs(userQuery);
    const todosList = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOriginalTodos(todosList); // Lưu danh sách gốc
    setTodos(todosList); // Cập nhật danh sách công việc và hiển thị danh sách tìm kiếm
    setTotalWorks(todosList.length); // Cập nhật số công việc hiện tại

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId !== null) {
      await handleUpdate(editingId); // Gọi hàm cập nhật nếu đang chỉnh sửa
    } else {
      await handleAdd(); // Gọi hàm thêm mới nếu không phải chỉnh sửa
    }
  };

  const handleAdd = async () => {
    if (value.trim() !== "") {
      await addDoc(collection(db, "todos"), {
        user,
        value,
        note,
        completed: false, // mặc định là chưa hoàn thành
        date: selectedDate,
      });
      setValue("");
      setNote("")
      setSelectedDate(new Date());
      toast.success(`Thêm ${value} thành công`);
      fetchTodos(); // Gọi hàm để lấy danh sách công việc sau khi thêm mới
    } else {
      toast.error('Vui lòng nhập công việc')
    }
  };

  const handleUpdate = async (id) => {
    if (value.trim() !== "") {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { value ,note , date: selectedDate });
      setEditingId(null);
      setValue("");
      setNote("")
      setSelectedDate(new Date());
      toast.success(`Đã update thành công`);
      fetchTodos(); // Gọi hàm để lấy danh sách công việc sau khi cập nhật
    } else {
      // alert("Vui lòng nhập dữ liệu");
      toast.error('Vui lòng nhập công việc')
    }
  };


  const handleEdit = (id, todoValue, todoNote, todoDate) => {
    setEditingId(id);
    setValue(todoValue);
    setNote(todoNote);
  
    // Nếu todoDate là một Timestamp, chuyển đổi thành Date trước khi gán vào selectedDate
    if (todoDate instanceof Date) {
      setSelectedDate(todoDate);
    } else if (todoDate instanceof Object && todoDate.toDate instanceof Function) {
      setSelectedDate(todoDate.toDate());
      console.log(todoDate.toDate());
    }
  };
  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa')

    if (confirmDelete) {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
      toast.success(`Xóa ${value} thành công`)
      fetchTodos();
    }
  };

  const handleToggleComplete = async (id, currentCompleted) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { completed: !currentCompleted });
    fetchTodos();
  }

  // Hàm xử lý sự kiện tìm kiếm

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const searchValue = e.target.value.toLowerCase();
    const searchResults = originalTodos.filter((todo) =>
      todo.value.toLowerCase().includes(searchValue)
    );
    setTodos(searchResults); // Cập nhật danh sách hiển thị với kết quả tìm kiếm
    setDisplaySearchText(value !== ""); // Hiển thị chữ nếu có giá trị trong ô tìm kiếm
  };

  const showNotePopup = (note) => {
    setPopupNote(note);
    setShowPopup(true);
  };




  //----------------------RENDER--------------------------------------------------------------------------------
  return (
    <div className="todolist-container">
      <form className="form-submit">
        <h1 className="form-title">
          Work List
        </h1>
        <input
          className="item form-input" type="text" placeholder="Nhập công việc..." value={value} onChange={(e) => setValue(e.target.value)}
        />
        <input
          className="item form-input" type="text" placeholder="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)}
        />
        <div>
          <span style={{fontSize : 20 , color : 'white' }}>Ngày tạo : </span>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="item form-date-picker"
         />
        </div>
        <button className="item form-btn-add" onClick={handleSubmit}>
          {editingId !== null ? "Lưu" : "Thêm"}
        </button>

        <input
          className="item form-input"
          type="text"
          placeholder="Tìm công việc..."
          value={searchValue}
          onChange={handleSearch}
        />
        {displaySearchText && (
          <div className="search-text">Kết quả tìm kiếm: {searchValue}</div>
        )}

      </form>
      <ul className="form-list">
        {todos.map((todo) => (
          <li className={`form-item ${todo.completed ? "completed" : ""}`} key={todo.id} >
          <div className="form-item-li" onClick={() => showNotePopup("Ghi chú: " + todo.note)}>
              {todo.value} 
              <div className="form-date">
                {todo.date instanceof Timestamp ? todo.date.toDate().toLocaleString() : ""}
              </div>
            </div>
            <div className="form-item-li">
              <button onClick={() => handleEdit(todo.id, todo.value, todo.note , todo.date)} className="btn btn-primary">
                <i className="bi bi-pencil-fill"></i>
              </button>
              <button onClick={() => handleDelete(todo.id)} className="btn btn-danger">
                <i className="bi bi-archive-fill"></i>
              </button>
              <button
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className={`btn completed-status ${todo.completed ? 'btn-success' : 'btn-warning'}`}
              >
                {todo.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
              </button>
            </div>
          </li>
        ))}
        <ToastContainer autoClose={1000} /> {/* Thành phần để hiển thị thông báo */}

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-popup" onClick={() => setShowPopup(false)}>
                x
              </button>
              <div className="popup-note">{popupNote}</div>
            </div>
          </div>
        )}

        <h5 className="total-work">Bạn hiện tại đang có {totalwork} công việc</h5>
      </ul>
    </div>
  );
}



