import React from 'react'
import { ClipLoader } from "react-spinners";


const Loading = () => {
  return (
    <div className="flex justify-center items-center py-4">
    <ClipLoader color="#00f" loading={loading} size={50} />
  </div>
)}

export default Loading