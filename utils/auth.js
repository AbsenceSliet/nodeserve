import jwt from 'jsonwebtoken'
import { AUTH } from '../app.config'

// 验证auth
const authToken = req => {
    if (!req.headers || !req.headers.authorization) {
        return false
    }
    const parts = req.headers.authorization.split(' ')
    console.log(parts, 'parts')
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1]
    }
}

// 验证权限
const authIsVerified = req => {
    const token = authToken(req)
    if (token) {
        try {
            const decodedToken = jwt.verify(token, AUTH.jwtToken)
            return (decodedToken.exp > Math.floor(Date.now() / 1000))
        } catch (err) {
            return false
        }
    }
    return false
}
export default authIsVerified