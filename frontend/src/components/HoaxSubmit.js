import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import { postHoax } from '../api/apiCalls';

const HoaxSubmit = () => {
    const user = useSelector((store) => ({ userName: store.username }));
    const image = useSelector((store) => ({ image: store.image }));
    const [focused, setFocused] = useState(false);
    const [hoax, setHoax] = useState('');
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    useEffect(() => {
        if (!focused) {
            setHoax('');
            setErrors({});
        }
    }, [focused]);

    useEffect(() => {
        setErrors({});
    },[hoax]);


    const onClickHoaxify = async () => {
        const body = {
            content: hoax,
            hoaxUser: user.userName,
        };
        try {
            await postHoax(body);
            setHoax(''); // Hoax alanını temizle
            setFocused(false); // Odaklanmayı kaldır
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
              }
        }
        
    };

    let textAreaClass = 'form-control';
    if(errors.content){
        textAreaClass += ' is-invalid';
    }

    return (
        <div className="card p-1 flex-row">
            <ProfileImageWithDefault
                image={image}
                width="32"
                height="32"
                className="rounded-circle mr-2"
            ></ProfileImageWithDefault>
            <div className="flex-fill">
                <textarea
                    className={textAreaClass}
                    rows={focused ? '3' : '1'}
                    onFocus={() => setFocused(true)}
                    onChange={(event) => setHoax(event.target.value)}
                    value={hoax}
                ></textarea>
                 <div className="invalid-feedback">{errors.content}</div>
                {focused && (
                    <div className="text-right mt-2">
                        <button className="btn btn-primary" onClick={onClickHoaxify}>
                            Hoaxify
                        </button>
                        <button
                            className="btn btn-light d-inline-flex ml-1"
                            onClick={() => setFocused(false)}
                        >
                            <i className="material-icons">close</i>
                            {t('Cancel')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HoaxSubmit;
