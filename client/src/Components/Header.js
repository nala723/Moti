import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import moti from '../assets/moti.svg';
import search from '../assets/search.svg';
import './Modal/modal.css'
import { useHistory } from 'react-router-dom';

import Modal from './Modal/Modal'

function Header({loginHandler, logoutHandler}) {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    const history = useHistory();

    if(userInfo.isLogin === false){
        history.push('/')
    }
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [modalState, setModalState] = useState('none');
    // modal state는 none, profile, password로 분기.

    const dropdownHandler = () => {
        console.log(dropdownVisible)
        setDropdownVisible(!dropdownVisible)
    }

    const modalHandler = (key) => (e) => {
        setModalState(key);
    }

    let image = 'data:image/png;base64, '+ Buffer(userInfo.profile, 'binary').toString('base64');
    return (
       <div className="header"> 
         <div className="header__container">
            <Link to='/mypage' className="header__container__logo">
                <img src={moti} alt={moti}/>
            </Link>
                {/* <div className="haeder__icon">
                      <i className={click? "fas fa-times" : "fas fa-bars"}/>
                    </div>
                     <ul className={click? "header__menu active" : "header__menu"}> */} {/* 반응형 haeder를 위한 구상*/}
                 <ul className="header__container__menu">
                    <li className="header__container__menu__item">
                       <Link to='/dashboard'>
                       <img src={search} alt={search}/>
                       </Link>
                    </li>
                    <li className="header__container__menu__item">
                        <Link to='/mypage' className="header__container__menu__item__profilebox">
                          <img src={image} alt="profile" className="header__container__menu__item__profilebox__profile" />
                        </Link>
                    </li>
                    <li className="header__container__menu__item header__container__menu__item__setting-box">
                        <button 
                            className='header__container__menu__item__setting-box__btn'
                            onClick={dropdownHandler}
                        >
                            <img src="https://img.icons8.com/material/50/000000/616B7C/settings--v5.png" 
                                className="header__container__menu__item__setting"/>
                        </button>
                        <div className={dropdownVisible? 'header__container__menu__item__setting-box__dropdown' : 'header__container__menu__item__setting-box__dropdown hide'}>
                            <ul>
                                <li className="header__container__menu__item__setting-box__dropdown__list" onClick={modalHandler('profile')}>
                                    프로필 수정
                                </li>
                                <li className="header__container__menu__item__setting-box__dropdown__list" onClick={modalHandler('password')}>
                                    비밀번호 변경
                                </li>
                                <li className="header__container__menu__item__setting-box__dropdown__list" onClick={logoutHandler}>
                                    로그아웃
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
          </div>
          {modalState!=='none'? <Modal modalState={modalState} modalHandler={modalHandler} loginHandler={loginHandler} userInfo={userInfo}/> : null}
       </div>
    )

}

export default Header