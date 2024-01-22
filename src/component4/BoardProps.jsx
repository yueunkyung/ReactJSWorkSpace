import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup, Table } from "react-bootstrap";

function BoardProps(props) {
    //내부에서 data 상태 관리: useState()
    const emptyBoard = {
        bno: 0,
        title: "",
        content: "",
        writer: "",
        active: false,
    };
    //const [count, setCount] = useState(0); //test용
    const [board, setBoard] = useState(emptyBoard);
    const [boardList, setBoardList] = useState([]);
    const nextBno = useRef(1); //rendering 시에 다시 초기화하지 않음. 값 유지
    const chageHandler = (e) => {
        setBoard({ ...board, [e.target.name]: e.target.value });
        /*
        var obj = {};
        var col = "bno";
        obj[col] = 100;
        console.log(obj);
        */
    };
    const addHandler = useCallback(() => {
        if (board.title === "" || board.content === "" || board.writer === "")
            return;
        //setCount(count + 1); //연관관계가 없을때는 사용 가능함.
        const newBoard = { ...board, bno: nextBno.current };
        /*
        setBoard({...board, bno:nextBno.current}); //주의 !!!! setter는 비동기 처리된다. 연결된 변수를 사용하는 경우 값 할당 장담 못함.
        setBoardList([...boardList, board]); // board로 연관...!
         */
        setBoardList([...boardList, newBoard]); //set()은 비동기 처리하기 때문에 setBoard 하기를 기다렸다가 setBoardList를 하지는 않음.
        nextBno.current++;
        setBoard(emptyBoard);
    }, [boardList, board]);

    const delHandler = (bno) => {
        setBoardList(boardList.filter((board) => board.bno !== bno));
    };
    const updateHandler = (bno) => {
        setBoardList(
            boardList.map((board) =>
                board.bno === bno ? { ...board, active: !board.active } : board
            )
        );
    };

    //life cycle 관리 //최초 rendering 시 수행, board가 set으로 변경되면 발생.
    useEffect(() => {}, [board]);
    useEffect(() => {
        console.log(boardList);
    }, [boardList]);
    useEffect(() => {
        //console.log("addHandler 변경됨");
    }, [addHandler]);

    return (
        <div>
            {/* <h1>count값: {count}</h1> */}
            <InputBoard
                chageHandler2={chageHandler}
                addHandler={addHandler}
                board={board}
            ></InputBoard>
            <DisplayBoard
                boardList={boardList}
                delHandler={delHandler}
                updateHandler={updateHandler}
            ></DisplayBoard>
        </div>
    );
}

export function InputBoard({ chageHandler2, addHandler, board }) {
    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="a">Default</InputGroup.Text>
                <Form.Control
                    aria-label="title입니다."
                    name="title"
                    onChange={chageHandler2}
                    value={board.title}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="b">content</InputGroup.Text>
                <Form.Control
                    aria-label="content입니다."
                    name="content"
                    onChange={chageHandler2}
                    value={board.content}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="c">writer</InputGroup.Text>
                <Form.Control
                    aria-label="writer입니다."
                    name="writer"
                    onChange={chageHandler2}
                    value={board.writer}
                />
            </InputGroup>
            <MyButton addHandler={addHandler}>ADD(+)</MyButton>
        </div>
    );
}
function MyButton({addHandler, children}) {
    return (
        <Button variant="success" onClick={addHandler}>
            {children}
        </Button>
    );
}

export function DisplayBoard({ boardList, delHandler, updateHandler }) {
    return (
        <Table striped bordered hover style={{verticalAlign: "middle"}}>
            <thead>
                <tr>
                    <th>bno</th>
                    <th>title</th>
                    <th>content</th>
                    <th>writer</th>
                    <th>active</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {boardList &&
                    boardList.map((board, seq) => (
                        <tr key={seq}>
                            <td>{board.bno}</td>
                            <td
                                style={{
                                    color: board.active ? "red" : "black",
                                }}
                            >
                                {board.title}
                            </td>
                            <td>{board.content}</td>
                            <td>{board.writer}</td>
                            <td>{board.active.toString()}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => delHandler(board.bno)}
                                >
                                    DEL
                                </Button>{" "}
                                <Button
                                    variant="info"
                                    onClick={() => updateHandler(board.bno)}
                                >
                                    UPDATE
                                </Button>{" "}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
}

export default BoardProps;