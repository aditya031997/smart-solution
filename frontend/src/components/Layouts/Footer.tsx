const Footer = () => {
    return (
      <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">
        © {new Date().getFullYear()}. FMS All rights reserved. Design and developed by{' '}
        <a href="http://www.mysmartsolution.co.in" target="_blank" rel="noopener noreferrer">
          <span style={{ color: 'red', fontWeight: 'bold' }}>Smart Solution</span>
        </a>
      </div>
    );
  };
  
  export default Footer;
  