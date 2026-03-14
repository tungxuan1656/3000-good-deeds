# Firebase Auth Setup

## 1) Create Firebase project
- Open Firebase Console
- Create/select project

## 2) Enable providers
- Enable Email/Password
- Enable Google sign-in

## 3) Configure authorized domains
- Add local and production domains

## 4) Get Firebase web config
- Copy API key/project settings into frontend `.env`

## 5) Configure backend verification
- Set `FIREBASE_PROJECT_ID` in backend env
- Ensure backend token verification uses the same project

## 6) Optional email templates
- Configure reset-password template in Firebase Auth templates

## 7) Local validation
- test signup/login
- test token exchange with backend
