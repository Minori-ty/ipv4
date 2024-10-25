import React, { useState, useEffect, useRef } from 'react';
import type { InputRef } from 'antd'; // 引入 InputRef 类型
import { StyleInput } from './index.styles';

interface InputIPv4Props {
    value?: string;
    onChange?: (value: string) => void;
}

const InputIPv4: React.FC<InputIPv4Props> = ({ value = '', onChange }) => {
    const [ipSegments, setIpSegments] = useState<string[]>(['', '', '', '']);

    // 创建 refs 数组来存储每个 antd Input 的 ref
    const inputRefs = useRef<(InputRef | null)[]>([]);

    useEffect(() => {
        if (value) {
            const segments = value.split('.');
            setIpSegments(segments);
        }
    }, [value]);

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;
        const newSegments = [...ipSegments];

        // 去掉前置的0，并且输入值要小于255
        if (/^\d{0,3}$/.test(inputValue)) {
            if (Number(inputValue) > 255) {
                inputValue = '255';
            } else if (inputValue.length > 1 && inputValue.startsWith('0')) {
                inputValue = String(Number(inputValue)); // 去掉前置的0
            }
            newSegments[index] = inputValue;
            setIpSegments(newSegments);

            // 自动跳到下一个输入框
            if (inputValue.length === 3 && index < 3) {
                inputRefs.current[index + 1]?.focus(); // 使用 antd 的 InputRef focus
            }

            if (onChange) {
                onChange(newSegments.join('.'));
            }
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        const inputValue = event.currentTarget.value;

        // 按下 Backspace 并且当前输入为空，跳到上一个输入框
        if (event.key === 'Backspace' && inputValue === '' && index > 0) {
            inputRefs.current[index - 1]?.focus(); // 使用 antd 的 InputRef focus
        }

        // 按下 "." 跳到下一个输入框
        if (event.key === '.' && inputValue.length > 0 && index < 3) {
            inputRefs.current[index + 1]?.focus(); // 使用 antd 的 InputRef focus
        }

        // 方向键移动
        if (event.key === 'ArrowLeft' && index > 0 && event.currentTarget.selectionStart === 0) {
            inputRefs.current[index - 1]?.focus(); // 使用 antd 的 InputRef focus
        }

        if (event.key === 'ArrowRight' && index < 3 && event.currentTarget.selectionEnd === inputValue.length) {
            inputRefs.current[index + 1]?.focus(); // 使用 antd 的 InputRef focus
        }
    };

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            {ipSegments.map((segment, index) => (
                <React.Fragment key={index}>
                    <StyleInput
                        ref={el => (inputRefs.current[index] = el)} // 使用 antd 的 InputRef
                        value={segment}
                        onChange={e => handleChange(index, e)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        maxLength={3}
                    />
                    {index !== 3 && <span>.</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default InputIPv4;
