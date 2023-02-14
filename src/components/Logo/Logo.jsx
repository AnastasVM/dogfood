import './index.css';
import logoSrc from './logo.svg'

// Логотип не всегда нужен кликабельный, например если мы на главной странице, поэтому прокидываем пропсы и прописываем условие/если придут дополнительные параметры, которых пока нет и они тоже отобразились/передались в <а>, используем рест опреатор (...), принято писать именно restProps.
function Logo({className, href, ...restProps}) {
  return (
    // условие: если href пришел то пусть он будет, а иначе будет заглушка/если пришел className, то давай его, а если нет сделаем стандартное лого
    <a href={href ? href : '#'} className={className ? className : 'logo'} {...restProps}>
        <img src={logoSrc} alt="Логотип компании" className='logo__pic' />
    </a>
  )
}

export default Logo;
