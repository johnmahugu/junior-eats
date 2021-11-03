import React, { useMemo, useEffect, useState } from 'react';
import { IMLocationTableCell, IMSimpleLocationTableCell, IMColorsTableCell, IMMultimediaTableCell, IMObjectTableCell, IMImagesTableCell, IMDateTableCell, IMForeignKeyTableCell, IMAddressTableCell } from '../../ui/IMTable';
import { IMColorBoxComponent, IMPhoto, IMModal, IMToggleSwitchComponent } from '../../../common'
import { useTable, usePagination } from "react-table";
import {
    Row,
    Col
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { getToken } from "../../../onboarding";
/* Insert extra imports for table cells here */

const baseAPIURL = require('../../config').baseAPIURL;

const categoriesColumns = [
    {
        Header: "Title",
        accessor: "title",
    },
    {
        Header: "Photo",
        accessor: "photo",
        Cell: data => (
            <IMImagesTableCell singleImageURL={data.value} />
        )
    },
    {
        Header: "Order",
        accessor: "order",
    },,
    {
        Header: "Actions",
        accessor: "actions",
        Cell: data => (
            <ActionsItemView data={data} />
        )
    }
]

function ActionsItemView(props) {
    const { data } = props
    const history = useHistory();

    const handleView = (item) => {
        const viewPath = "/admin/category/" + item.id + '/view'
        history.push(viewPath)
    }

    const handleEdit = (item) => {
        const editPath = "/admin/category/" + item.id + '/update'
        history.push(editPath)
    }

    const handleDelete = async (item) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const response = await fetch(baseAPIURL + 'category/' + item.id, {
                method: 'DELETE' // *GET, POST, PUT, DELETE, etc.
            });
            window.location.reload(false);
        }
    }

    return (
        <div className="inline-actions-container">
            <button onClick={() => handleView(data.row.original)} type="button" id="tooltip264453216" className="btn-icon btn btn-info btn-sm"><i className="fa fa-list"></i></button>
            <button onClick={() => handleEdit(data.row.original)} type="button" id="tooltip366246651" className="btn-icon btn btn-success btn-sm"><i className="fa fa-edit"></i></button>
            <button onClick={() => handleDelete(data.row.original)} type="button" id="tooltip476609793" className="btn-icon btn btn-danger btn-sm"><i className="fa fa-times"></i></button>
        </div>
    )
}

function CategoriesListView(props) {
    const listName = "categories"

    const [isLoading, setIsLoading] = useState(true);
    const [controlledPageCount, setControlledPageCount] = useState(0)
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);


    const columns = useMemo(
        () => categoriesColumns,
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        //pagination
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: categories,
            initialState: { pageIndex: 0 },
            manualPagination: true,
            pageCount: controlledPageCount, 
        }, usePagination
    )

    useEffect(() => {
        const token = getToken()
        const config = {
            headers: { 'Authorization': token }
        };

        const extraQueryParams = null
        setIsLoading(true)

        fetch(baseAPIURL + listName + (extraQueryParams ? extraQueryParams : ""), config)
            .then(response => response.json())
            .then(data => {
                const categories = data.categories;
                setData(categories)

                setIsLoading(false)
            })
            .catch(err => { console.log(err) });


    }, []);

    useEffect(() => {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize

        setCategories(data.slice(startRow, endRow))
        setControlledPageCount(Math.ceil(data.length / pageSize))

    }, [pageIndex, pageSize, data])

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <div className="Card">
                            <div className="CardHeader">
                                <a className="Link AddLink" href="/admin/category/add">Add New</a>
                                <h4>Categories</h4>
                            </div>
                            <div className="CardBody">
                                <div className="TableContainer">
                                    <table className="Table" {...getTableProps()}>
                                        <thead>
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {page.map((row, i) => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map(cell => {
                                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                {isLoading ? (
                                                    <td colSpan={categoriesColumns.length - 1}>
                                                        <p>
                                                            Loading...
                                                        </p>
                                                    </td>
                                                ) : (
                                                        <td colSpan={categoriesColumns.length - 1}>
                                                            <p className="PaginationDetails">
                                                                Showing {page.length} of {data.length}{' '} results
                                                            </p>
                                                        </td>
                                                    )}
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="Pagination">
                                        <div className="LeftPaginationButtons">
                                            <button onClick={() => gotoPage(0)} className="PaginationButton" disabled={!canPreviousPage}>
                                                <i className="fa fa-angle-double-left"></i>
                                            </button>{' '}
                                            <button onClick={() => previousPage()} className="PaginationButton" disabled={!canPreviousPage}>
                                                <i className="fa fa-angle-left"></i>
                                            </button>
                                        </div>
                                        <div className="CenterPaginationButtons">
                                            <span>
                                                Page{' '}
                                                <strong>
                                                    {pageIndex + 1} of {pageOptions.length}
                                                </strong>{' '}
                                            </span>
                                            <span>
                                                | Go to page:{' '}
                                                <input
                                                    type="number"
                                                    defaultValue={pageIndex + 1}
                                                    onChange={e => {
                                                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                                                        gotoPage(page)
                                                    }}
                                                    style={{ width: '100px' }}
                                                />
                                            </span>{' '}
                                            <select
                                                value={pageSize}
                                                onChange={e => {
                                                    setPageSize(Number(e.target.value))
                                                }}
                                            >
                                                {[10, 20, 30, 40, 50].map(pageSize => (
                                                    <option key={pageSize} value={pageSize}>
                                                        Show {pageSize}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="RightPaginationButtons">
                                            <button onClick={() => nextPage()} className="PaginationButton" disabled={!canNextPage}>
                                                <i className="fa fa-angle-right"></i>
                                            </button>{' '}
                                            <button onClick={() => gotoPage(pageCount - 1)} className="PaginationButton" disabled={!canNextPage}>
                                                <i className="fa fa-angle-double-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default CategoriesListView