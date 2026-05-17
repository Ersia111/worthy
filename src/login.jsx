import { useState } from 'react'
import './login.css'

function Login({ onBackHome, onGoAdmin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  function resetMessage() {
    setMessage('')
    setMessageType('')
  }

  function getSavedUsers() {
    const savedUsers = localStorage.getItem('worthyUsers')
    return savedUsers ? JSON.parse(savedUsers) : []
  }

  function saveUsers(users) {
    localStorage.setItem('worthyUsers', JSON.stringify(users))
  }

  function getSavedAdmins() {
    const savedAdmins = localStorage.getItem('worthyAdmins')
    return savedAdmins ? JSON.parse(savedAdmins) : []
  }

  function saveAdmins(admins) {
    localStorage.setItem('worthyAdmins', JSON.stringify(admins))
  }

  function isWorthyAdminEmail(adminEmail) {
    return adminEmail.trim().toLowerCase().endsWith('@worthy.com')
  }

  function handleCreateAccount() {
    resetMessage()

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('Please fill in your name, email, and password.')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      setMessageType('error')
      return
    }

    const users = getSavedUsers()
    const accountExists = users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (accountExists) {
      setMessage('An account with this email already exists. Please log in.')
      setMessageType('error')
      return
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    setMessage('Account created successfully. You can log in now.')
    setMessageType('success')
    setMode('login')
    setName('')
    setPassword('')
  }

  function handleUserLogin() {
    resetMessage()

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter your email and password.')
      setMessageType('error')
      return
    }

    const users = getSavedUsers()
    const user = users.find(
      (savedUser) =>
        savedUser.email.toLowerCase() === email.trim().toLowerCase() &&
        savedUser.password === password
    )

    if (!user) {
      setMessage('Wrong email or password. Create an account if you do not have one.')
      setMessageType('error')
      return
    }

    localStorage.setItem('worthyCurrentUser', JSON.stringify(user))
    setMessage(`Welcome back, ${user.name}!`)
    setMessageType('success')
  }

  function handleAdminLogin() {
    resetMessage()

    if (!email.trim() || !password.trim()) {
      setMessage('Enter the admin email and password first.')
      setMessageType('error')
      return
    }

    if (!isWorthyAdminEmail(email)) {
      setMessage('Admin email must be like example@worthy.com.')
      setMessageType('error')
      return
    }

    const defaultAdmins = [
      {
        name: 'Jona',
        email: 'jona@worthy.com',
        password: '123456',
        role: 'admin',
      },
      {
        name: 'Admin',
        email: 'admin@worthy.com',
        password: '123456',
        role: 'admin',
      },
    ]

    const admins = getSavedAdmins()
    const admin =
      defaultAdmins.find(
        (defaultAdmin) =>
          email.trim().toLowerCase() === defaultAdmin.email &&
          password === defaultAdmin.password
      ) ||
      admins.find(
        (savedAdmin) =>
          savedAdmin.email.toLowerCase() === email.trim().toLowerCase() &&
          savedAdmin.password === password
      )

    if (!admin) {
      setMessage('Admin account not found or password is incorrect.')
      setMessageType('error')
      return
    }

    localStorage.setItem('worthyAdminLoggedIn', 'true')
    localStorage.setItem('worthyCurrentAdmin', JSON.stringify(admin))
    onGoAdmin()
  }

  function handleCreateAdminAccount() {
    resetMessage()

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('Please fill in admin name, email, and password.')
      setMessageType('error')
      return
    }

    if (!isWorthyAdminEmail(email)) {
      setMessage('Admin email must be like example@worthy.com.')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Admin password must be at least 6 characters.')
      setMessageType('error')
      return
    }

    const admins = getSavedAdmins()
    const adminExists = admins.some(
      (admin) => admin.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (adminExists) {
      setMessage('An admin account with this email already exists. Please log in.')
      setMessageType('error')
      return
    }

    const newAdmin = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }

    saveAdmins([...admins, newAdmin])
    setMessage('Admin account created successfully. You can log in now.')
    setMessageType('success')
    setMode('admin')
    setName('')
    setPassword('')
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    resetMessage()
    setPassword('')
    setName('')
  }

  return (
    <main className="loginPage">
      <section className="loginCard">
        <button className="loginBackButton" type="button" onClick={onBackHome}>
          ← Back Home
        </button>

        <div className="loginHeader">
          <p className="loginEyebrow">
            {mode === 'signup'
              ? 'Join Worthy'
              : mode === 'adminSignup'
              ? 'Create admin access'
              : mode === 'admin'
              ? 'Admin access'
              : 'Welcome back to Worthy'}
          </p>

          <h2>
            {mode === 'signup'
              ? 'Create your account'
              : mode === 'adminSignup'
              ? 'Create admin account'
              : mode === 'admin'
              ? 'Admin login'
              : 'Login to your account'}
          </h2>

          <p>
            {mode === 'signup'
              ? 'Create an account to save your details and manage your custom beauty orders.'
              : mode === 'adminSignup'
              ? 'Create an admin account using a Worthy business email, like example@worthy.com.'
              : mode === 'admin'
              ? 'Log in as an admin to manage customer orders and update their status.'
              : 'Access your custom beauty orders, save your details, and continue building your personalized brand.'}
          </p>
        </div>

        <form
          className="loginForm"
          onSubmit={(event) => {
            event.preventDefault()

            if (mode === 'signup') {
              handleCreateAccount()
            } else if (mode === 'adminSignup') {
              handleCreateAdminAccount()
            } else if (mode === 'admin') {
              handleAdminLogin()
            } else {
              handleUserLogin()
            }
          }}
        >
          {(mode === 'signup' || mode === 'adminSignup') && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder={
                mode === 'admin' || mode === 'adminSignup'
                  ? 'example@worthy.com'
                  : 'Enter your email'
              }
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder={
                mode === 'admin' || mode === 'adminSignup'
                  ? 'Enter admin password'
                  : 'Enter your password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === 'signup' || mode === 'adminSignup'
                  ? 'new-password'
                  : 'current-password'
              }
            />
          </label>

          {mode === 'login' && (
            <div className="loginOptions">
              <label className="rememberMe">
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button" className="forgotPasswordButton">
                Forgot password?
              </button>
            </div>
          )}

          {message && <p className={`loginMessage ${messageType}`}>{message}</p>}

          <button type="submit" className="loginMainButton">
            {mode === 'signup'
              ? 'Create account'
              : mode === 'adminSignup'
              ? 'Create admin account'
              : mode === 'admin'
              ? 'Login as admin'
              : 'Login'}
          </button>
        </form>

        {(mode === 'login' || mode === 'signup') && (
          <div className="signupBox">
            <p>{mode === 'signup' ? 'Already have an account?' : 'Don’t have an account?'}</p>
            <button
              type="button"
              onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
            >
              {mode === 'signup' ? 'Back to login' : 'Create account'}
            </button>
          </div>
        )}

        {(mode === 'admin' || mode === 'adminSignup') && (
          <div className="signupBox">
            <p>
              {mode === 'adminSignup'
                ? 'Already have an admin account?'
                : 'Need admin access?'}
            </p>
            <button
              type="button"
              onClick={() => switchMode(mode === 'adminSignup' ? 'admin' : 'adminSignup')}
            >
              {mode === 'adminSignup' ? 'Back to admin login' : 'Create admin account'}
            </button>
          </div>
        )}

        <div className="adminAccessBox">
          <p>
            {mode === 'admin' || mode === 'adminSignup'
              ? 'Want to return to customer login?'
              : 'For business management'}
          </p>

          <button
            type="button"
            className="adminLoginButton"
            onClick={() =>
              switchMode(mode === 'admin' || mode === 'adminSignup' ? 'login' : 'admin')
            }
          >
            {mode === 'admin' || mode === 'adminSignup' ? 'Customer login' : 'Admin'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default Login