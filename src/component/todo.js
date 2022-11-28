import React, { useState, useEffect } from 'react';
import logo from './logo.png';

// to get the data from local storage
const getLocalItems = () => {
	let list = localStorage.getItem('lists');

	if (list) {
		return JSON.parse(localStorage.getItem('lists'));
	} else {
		return [];
	}
};

const Todo = () => {
	const [inputData, setInputData] = useState('');
	const [items, setItems] = useState(getLocalItems());
	const [toggleSubmit, setToggleSubmit] = useState(true);
	const [isEditItem, setIsEditItem] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

	//add items
	const addItem = () => {
		if (!inputData) {
			setErrorMessage('Error!! please add some text');
		} else if (inputData && !toggleSubmit) {
			setItems(
				items.map((elem) => {
					if (elem.id === isEditItem) {
						return { ...elem, title: inputData };
					}
					return elem;
				})
			);
			setToggleSubmit(true);
			setInputData('');
			setIsEditItem(null);
			setErrorMessage('');
		} else {
			const allInputData = { id: new Date().getTime().toString(), title: inputData };
			setItems([...items, allInputData]);
			setInputData('');
			setErrorMessage('');
		}
	};

	//fetch data
	const fetchData = () => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setItems(data);
			});
	};

	//delete items
	const deleteItem = (index) => {
		// console.log(index);
		const updateItems = items.filter((elem) => {
			return index !== elem.id;
		});

		setItems(updateItems);
	};

	//edit items
	const editItem = (id) => {
		let newEditItem = items.find((elem) => {
			return elem.id == id;
		});
		// console.log(newEditItem);

		setToggleSubmit(false);
		setInputData(newEditItem.title);
		setIsEditItem(id);
	};

	//remove all items
	const removeAll = () => {
		setItems([]);
	};

	useEffect(() => {
		fetchData();
	}, []);

	// add data to local Storage
	useEffect(() => {
		localStorage.setItem('lists', JSON.stringify(items));
	}, [items]);

	return (
		<>
			<div className='main-div'>
				<div className='child-div'>
					<figure>
						<img src={logo} alt='' />

						<figcaption>Add your list here ✌</figcaption>
					</figure>
					<div className='addItems'>
						<input type='text' placeholder='✍ Add Items...' value={inputData} onChange={(e) => setInputData(e.target.value)} />

						{toggleSubmit ? (
							<i className='fa fa-plus add-btn' title='Add Items' onClick={addItem}></i>
						) : (
							<i className='far fa-edit add-btn' title='update Items' onClick={addItem}></i>
						)}

						<p className='error'>{errorMessage}</p>
					</div>
					<div className='showItems'>
						{items.map((elem) => {
							return (
								<div className='eachItem' key={elem.id}>
									<h3>{elem.title}</h3>
									<div className='todo-btn'>
										<i className='far fa-edit add-btn' title='Edit Items' onClick={() => editItem(elem.id)}></i>
										<i className='far fa-trash-alt add-btn' title='Delete Items' onClick={() => deleteItem(elem.id)}></i>
									</div>
								</div>
							);
						})}
					</div>

					<div className='showItems'>
						<button className='btn effect04' data-sm-link-text='REMOVE ALL' onClick={removeAll}>
							<span>CHECK LIST</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Todo;
