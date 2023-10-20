import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddlewares implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `method: ${method}, originalUrl: ${originalUrl}, statusCode: ${statusCode} / userAgent: ${userAgent}, ip: ${ip}`,
      );
    });

    next();
  }
}
