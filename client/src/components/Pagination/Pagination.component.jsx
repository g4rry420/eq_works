import React from 'react'
import { Pagination } from "react-bootstrap"

import "./Pagination.styles.css"

const PaginationComponent = (props) => {
    const { 
        handleFirstPagination,
        handlePrevPagination,
        pagination,
        initialPagination,
        handlePaginationNumberClick,
        handleNextPagination,
        handleLastPagination
     } = props;
    return (
        <div className="pagination-container">
        <Pagination>
            <Pagination.First onClick={handleFirstPagination} />
            <Pagination.Prev onClick={handlePrevPagination} />
            {
                pagination && pagination.map((entry, idx) => {
                    if(initialPagination === entry){
                        return <Pagination.Item key={idx} active> {entry} </Pagination.Item>
                    }else if(initialPagination === 5 && entry === 2){
                        return <Pagination.Ellipsis key={idx} />
                    }else if(initialPagination >= 6 && entry === 2) return;
                    else if((initialPagination === 5 && entry === 3) || (initialPagination >= 6 && entry === 3)) return;
                    else if(initialPagination >= 6 && entry === 4){
                        return <Pagination.Ellipsis key={idx} />
                    }
                    else if(entry === 6 && initialPagination !== 5 && initialPagination <= 6){
                        return (
                            <Pagination.Ellipsis key={idx} />
                        )
                    }
                    else if((initialPagination === 5 && entry === 6)){
                        return <Pagination.Item key={idx} onClick={() => handlePaginationNumberClick(entry)}> {entry} </Pagination.Item>
                    }else if(initialPagination === 5 && entry === 7){
                        return <Pagination.Ellipsis key={idx} />
                    }
                    else if(entry === 9){
                        return (
                            <Pagination.Item key={idx} onClick={() => handlePaginationNumberClick(entry)}> {entry} </Pagination.Item>
                        )
                    }else if(initialPagination >= 6 && entry >= 7 && entry <= 8){
                        return  <Pagination.Item key={idx} onClick={() => handlePaginationNumberClick(entry)}> {entry} </Pagination.Item>
                    } 
                    else if(entry === 7 && initialPagination !== 5) return;
                    else if(entry === 8 ) return;
                    else{
                        return (
                            <Pagination.Item key={idx} onClick={() => handlePaginationNumberClick(entry)}> {entry} </Pagination.Item>
                        )
                    }
                })
            }
            <Pagination.Next onClick={handleNextPagination} />
            <Pagination.Last onClick={handleLastPagination} />
        </Pagination>
        </div>
    )
}

export default PaginationComponent