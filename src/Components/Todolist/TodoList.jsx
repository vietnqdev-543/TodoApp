


import { useState, useEffect } from "react";
import { db } from "../Auth/Config";
import { collection,addDoc,doc, query, where, getDocs, updateDoc, deleteDoc,} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Todolist.scss";
import { Timestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify'; // thư viện thông báo react
import 'react-toastify/dist/ReactToastify.css';


export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]); // Danh sách công việc
  const [value, setValue] = useState(""); // Nội dung công việc
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày và giờ
  const [editingId, setEditingId] = useState(null); 
  // ID công việc đang chỉnh sửa

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
    setTodos(todosList); // Cập nhật danh sách công việc
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
        completed: false,
        date: selectedDate,
      });

      setValue("");
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
      await updateDoc(todoRef, { value, date: selectedDate });
      setEditingId(null);
      setValue("");
      setSelectedDate(new Date());
      toast.success(`Đã update thành công`);
      fetchTodos(); // Gọi hàm để lấy danh sách công việc sau khi cập nhật
    } else {
      // alert("Vui lòng nhập dữ liệu");
      toast.error('Vui lòng nhập công việc')
    }
  };


  const handleEdit = (id, todoValue, todoDate) => {
    setEditingId(id);
    setValue(todoValue);
  
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

    if(confirmDelete){
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
      toast.success(`Xóa ${value} thành công`)
      fetchTodos(); 
    }
 
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
        <DatePicker 
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="item form-date-picker"
        />
        <button className="item form-btn-add" onClick={handleSubmit}>
          {editingId !== null ? "Lưu" : "Thêm"}
        </button>

      </form>

      <ul className="form-list">
        {todos.map((todo) => (
          <li className="form-item" key={todo.id}>
            <div className="form-item-li">
              {todo.value}   
              <div className="form-date ">
                {todo.date instanceof Timestamp ? todo.date.toDate().toLocaleString() : ""}
              </div>
            </div>
            <div className="form-item-li">
              <button onClick={() => handleEdit(todo.id, todo.value, todo.date)} className="btn btn-primary">
              <i className="bi bi-pencil-fill"></i>
              </button>
              <button onClick={() => handleDelete(todo.id)} className="btn btn-danger">
              <i className="bi bi-archive-fill"></i>
              </button>
            </div>
            
          </li>
          
        ))}
      <ToastContainer autoClose={1000}/> {/* Thành phần để hiển thị thông báo */}

      </ul>
    </div>
  );
}



