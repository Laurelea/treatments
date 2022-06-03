import React from 'react';
import { NavLink }  from "react-router-dom";

const Newheader = () =>  {
    return (
        <React.Fragment>
            <h1 id="mainheader" className="logo">
                <NavLink to="/"> Проект по обработкам растений </NavLink>
            </h1>
            <nav className="Nav">
                <div className="nav-wrapper">
                    <ul className="nav-mobile">
                        <li className="active"><NavLink to="/" exact>ГЛАВНАЯ</NavLink></li>
                        <li className="active"><NavLink to="/show-templates" exact>Шаблоны</NavLink></li>
                        <li className="active"><NavLink to="/show-treatments" exact>Обработки</NavLink></li>
                        <li className="active"><NavLink to="/show-components" exact>Компоненты</NavLink></li>
                    </ul>
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Newheader
