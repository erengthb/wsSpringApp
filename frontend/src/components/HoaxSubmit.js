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
    const [error, setError] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        if (!focused) {
            setHoax('');
            setError(undefined);
        }
    }, [focused]);

    useEffect(() => {
        setError(undefined); // Yeni bir değişiklik yapılırsa önceki hatayı temizle
    }, [hoax]);

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
            // Validation hatalarını kontrol et ve ilk hatayı al
            const validationErrors = error.response?.data?.validationErrors;
            if (validationErrors && validationErrors.content) {
                setError(validationErrors.content);
            } 
        }
        
    };

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
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    rows={focused ? '3' : '1'}
                    onFocus={() => setFocused(true)}
                    onChange={(event) => setHoax(event.target.value)}
                    value={hoax}
                ></textarea>
                {error && <div className="invalid-feedback">{error}</div>}
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
