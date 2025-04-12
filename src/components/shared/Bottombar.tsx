import { NavLink, useLocation } from 'react-router-dom'
import { bottombarLinks } from '../../constants';
import { INavLink } from '../../types';

function Bottombar() {
    const {pathname} = useLocation();
  return (
    <div className='bottom-bar'>
      {bottombarLinks.map((link:INavLink, i)=>{
            const isActive = pathname === link.route;
            return(
            <NavLink to={link.route}  key={i} className={`flex-center flex-col gap-1 p-2 transition ${isActive && 'bg-primary-500 rounded-[10px]'}`}>
            <img 
            src={link.imgURL} 
            alt={link.label} 
            className={`${isActive && 'invert-white'}`} 
            width={16}
            height={16}
            />{/**for elements to hover on parent hover use grp hover */}
            <p className='tiny-medium text-light-2'>{link.label}</p>
        </NavLink>
          )})}
    </div>
  )
}

export default Bottombar
