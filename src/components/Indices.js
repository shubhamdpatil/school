import React from 'react';

export default function render(props) {

    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ color: 'red', margin: '20px' }} >
                    {`${props.base} ^ 2 \\times 3 ^ 4$ `}
                </div>
                <div style={{ color: 'red', margin: '20px'}}>
                    {`$3 ^ 2 \\times 3 ^ 4$ `}
                </div>
            </div>
            <div style={{ color: 'red' }}> {`$3 ^ 2 \\times 3 ^ 4$ `}</div>
        </div>
    )
}