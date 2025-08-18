import {assets} from '../assets/admin_assets/assets'

const Navbar = () => {
  return (
    <div>
      <img src={assets.logo} alt="" />
      <button> Logout </button>
    </div>
  )
}

export default Navbar