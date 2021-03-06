import React, { useState } from "react";
import axios from 'axios';

export default function EditPassword ({accessTokenHandler, loginHandler, userInfo, modalState, modalHandler }) {
    const [currentInput, setCurrentInput] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordCheck: ''
    })

    const [errorVisible, setErrorVisible] = useState({
        currentPassword:false,
        newPassword:false,
        newPasswordCheck:false,
        somethingMissed:false
    })

    const [editError, setEditError] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);

    const handleInputValue = (key) => (e) => {
        setEditError(false)
        setEditSuccess(false)
        setCurrentInput({ ...currentInput, [key]:e.target.value})
    }

    const validationCheck = (key) => (e) => {
        let value = e.target.value;
        let regPassword = /^[a-zA-Z0-9]{8,20}$/
        if(key==='newPassword'){
            if(value===currentInput.newPasswordCheck){
                setErrorVisible({...errorVisible, newPasswordCheck:false})
            }
            if(regPassword.test(value)){
                setErrorVisible({...errorVisible, [key]:false})
            }else{
                setErrorVisible({...errorVisible, [key]:true})
            }
        }else if (key==='newPasswordCheck'){
            if(value===currentInput.newPassword){
                setErrorVisible({...errorVisible, [key]:false})
            }else{
                setErrorVisible({...errorVisible, [key]:true})
            }
        }
    }

    const onSubmitHandler = (e) => {
        if(!!(currentInput.currentPassword) && !!(currentInput.newPassword) && !!(currentInput.newPasswordCheck) && !(userInfo.isSocial)){
            setErrorVisible({...errorVisible, somethingMissed:false});
            let tmpAccessToken = 'Bearer ' + userInfo.accessToken;
            if(!(errorVisible.currentPassword) && !(errorVisible.newPassword) && !(errorVisible.newPasswordCheck)){
                axios
                    .put(process.env.REACT_APP_URL+'/user/changepassword',{
                        nowpassword: currentInput.currentPassword,
                        newpassword: currentInput.newPassword
                    },
                    {
                        headers:{
                            authorization:tmpAccessToken
                        }
                    })
                    .then((res)=>{
                        if(res.headers.accessToken){
                            accessTokenHandler(res.headers.accessToken)
                        }
                        setEditSuccess(true)
                        setErrorVisible({...errorVisible, somethingMissed:false})
                    })
                    .catch( error => {
                        console.log('email change fail')
                        setEditError(true);
                    })
            }
        } else {
                setErrorVisible({...errorVisible, somethingMissed:true})
            }
    }

    return(
        <div className='header__setting-modal__password'>
            <div className='header__setting-modal__password__tittle'>
                ???????????? ??????
            </div>
            <div className='header__setting-modal__password__input'>
                <div className='header__setting-modal__password__input__current-password modal-sub-form'>
                    <div className='header__setting-modal__password__input__current-password__text modal-sub-tittle'>
                        ?????? ????????????
                    </div>
                    <input
                        className='header__setting-modal__password__input__current-password__input'
                        type='password'
                        name='currentPassword'
                        onChange={handleInputValue('currentPassword')}
                        onBlur={validationCheck('currentPassword')}
                        disabled = {userInfo.isSocial? 'disabled' : ''}
                    />
                    <div className= {errorVisible.currentPassword? 'header__setting-modal__password__input__current-password__error error' : 'header__setting-modal__password__input__current-password__error error hide'}>

                    </div>
                </div>
                <div className='header__setting-modal__password__input__new-password modal-sub-form'>
                    <div className='header__setting-modal__password__input__new-password__text modal-sub-tittle'>
                        ??? ????????????
                    </div>
                    <input
                        className='header__setting-modal__password__input__new-password__input'
                        type='password'
                        name='newPassword'
                        onChange={handleInputValue('newPassword')}
                        onBlur={validationCheck('newPassword')}
                        disabled = {userInfo.isSocial? 'disabled' : ''}
                    />
                    <div className= {errorVisible.newPassword? 'header__setting-modal__password__input__new-password__error error' : 'header__setting-modal__password__input__new-password__error error hide'}>
                        ??????????????? ????????? ????????? ???????????? 8~20????????? ???????????? ?????????.
                    </div>
                </div>
                <div className='header__setting-modal__password__input__new-password-check modal-sub-form'>
                    <div className='header__setting-modal__password__input__new-password-check__text modal-sub-tittle'>
                        ???????????? ??????
                    </div>
                    <input
                        className='header__setting-modal__password__input__new-password-check__input'
                        type='password'
                        name='newPasswordCheck'
                        onChange={handleInputValue('newPasswordCheck')}
                        onBlur={validationCheck('newPasswordCheck')}
                        disabled = {userInfo.isSocial? 'disabled' : ''}
                    />
                    <div className={errorVisible.newPasswordCheck? 'header__setting-modal__password__input__new-password-check__error error' : 'header__setting-modal__password__input__new-password-check__error error hide'}>
                        ??????????????? ???????????? ????????????.
                    </div>
                </div>
            </div>
            <div className='header__setting-modal__password__btn'>
                <button className='header__setting-modal__password__btn__change' 
                    onClick={onSubmitHandler}
                    disabled = {userInfo.isSocial? 'disabled' : ''}
                >
                    ??????
                </button>
                <button className='header__setting-modal__password__btn__cancel'
                    onClick={modalHandler('none')}
                >
                    ??????
                </button>
            </div>
            <div className='header__setting-modal__password__error'>
                <div className={errorVisible.somethingMissed? 'header__setting-modal__password__error__something-missed error' : 'header__setting-modal__password__error__something-missed error hide'}>
                    ?????? ????????? ??????????????????.
                </div>
                <div className={editError? 'header__setting-modal__password__error__fail error' : 'header__setting-modal__password__error__fail error hide'}>
                    ?????? ??????????????? ???????????? ????????????.
                </div>
                <div
                    className={editSuccess? 'header__setting-modal__password__error__success' : 'header__setting-modal__password__error__success hide'}
                >
                    ??????????????? ?????????????????????.
                </div>
                <div
                    className={userInfo.isSocial? 'header__setting-modal__password__error__social error' : 'header__setting-modal__password__error__social error hide'}
                >
                    ?????? ????????? ????????? ??????????????? ????????? ??? ????????????.
                </div>
            </div>
        </div>
    )
}