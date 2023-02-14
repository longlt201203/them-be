import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const CurrentUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});

export default CurrentUser;