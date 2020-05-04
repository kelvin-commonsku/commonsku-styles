import React, { ReactNode, useEffect, useState, useRef } from 'react';
import styled from 'styled-components'
import { getColor } from './Theme';
import { Button } from './Button';
import { DownArrowIcon, UpArrowIcon } from './icons';


export const StyledDropdown = styled.div`
    position: relative;
    display: inline-block;
`;

type DropdownContentProps = {
    primary?: boolean,
    underlined?: boolean,
    text?: string,
}

export const DropdownItem = styled.div<DropdownContentProps>`
    color: ${p => getColor('primary')};
    padding: 8px 8px;
    text-decoration: none;
    display: block;
    ${p => p.underlined && 
        `border-bottom: 1px solid ${getColor(p.primary ? 'primary' : 'white')};`
    }
    :last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: ${p => getColor('bgblue')};
        border-radius: 5px;
        cursor: pointer;
    }
`;

export const DropDownContent = styled.div<DropdownContentProps>`
    display: block;
    position: absolute;
    background-color: ${p => getColor(p.primary ? 'white' : 'white')};
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 8px 8px;
    z-index: 1;
    border-radius: 5px;
    text-align: left;
/*
    a {
        color: ${p => getColor(p.primary ? 'primary' : 'cta')};
        padding: 8px 8px;
        text-decoration: none;
        display: block;
        ${p => p.underlined && 
            `border-bottom: 1px solid ${getColor(p.primary ? 'primary' : 'white')};`
        }
        font-weight: bold;
        :last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: ${p => getColor(p.primary ? 'primary0' : 'cta')};
            color: ${p => getColor(p.primary ? 'texttitle' : 'white')};
            border-radius: 5px;
            cursor: pointer;
        }
    }
*/
`;

export const Dropdown = ({ items, underlined, primary, text, ...props }: {
    items: Array<{onClick?: Function|VoidFunction|null, props?:{[key: string]: any, underlined?:boolean}, content: ReactNode|string|any}>
} & DropdownContentProps) => {

    const node = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const iconProps = {
        width: '10px',
        fill: getColor(primary ? 'primary100' : 'white'),
        style: {verticalAlign: 'middle', transitionDuration: '.3s', transform: 'rotate(' + ( showMenu ? 0 : 180 ) + 'deg)'},
    };

    const handleClick = (e: Event) => {
        // @ts-ignore
        if (node.current?.contains(e.target)) {
          return;
        }
        setShowMenu(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
    }, []);


    return (
        // @ts-ignore
        <StyledDropdown ref={node} {...props}>
            <Button cta={Boolean(!primary)} onClick={() => setShowMenu(!showMenu)}>
                {text ? text : "Actions"} <UpArrowIcon {...iconProps} />
            </Button>
            {showMenu && <DropDownContent underlined={underlined} primary={primary}>
                {items.map((item, i) => {
                    return item && <DropdownItem key={'dropdown-item-'+i}
                        {...item.props}
                        primary={primary}
                        underlined={item.props && item.props.underlined ? item.props.underlined : underlined}
                        onClick={() => {
                            setShowMenu(false);
                            item.onClick && item.onClick()
                        }}
                    >{item.content}</DropdownItem>
                })}
            </DropDownContent>}
        </StyledDropdown>
    );
}