import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OrderList from './components/OrderList'
import BookOrder from './pages/BookOrder'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/book-order" element={<BookOrder />} />
      </Routes>
    </BrowserRouter>
  )
}
