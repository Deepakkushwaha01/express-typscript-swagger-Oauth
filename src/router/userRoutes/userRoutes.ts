import {
  registerUserController,
  loginUserController
} from '../../controllers/userController/userController.ts'
import { Router } from 'express'
import { routerPath } from '../../enums/routerPath.ts'

export default ({ router }: { router: Router }) => {
  router.post(routerPath.USER.SIGNUP, registerUserController)
  router.post(routerPath.USER.LOGIN, loginUserController)
}
