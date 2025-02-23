import Avatar from '@/components/Avatar';
import React from 'react';

const Loading = () => {
    return (
        <div className='mx-auto animate-spin p-10'>
            <Avatar seed='AI ChatBot Loading Screen' />
        </div>
    );
};

export default Loading;