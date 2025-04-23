const Header = ({ username = 'user' }) => {
    return (
      <header className="header">
        <div className="logo">NotionLite</div>
        <div className="user-info">
          <span className="username">Hello, {username}!</span>
        </div>
      </header>
    );
  };
  
  export default Header;
  