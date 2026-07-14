import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/AppError';

// Gates a premium-only endpoint (§6). Reads the tier from the access token, so a
// freshly-upgraded user must refresh their token for this to take effect (the
// course multi-course gate reads User.tier from the DB and applies immediately).
export function requirePremium(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.tier !== 'premium') {
    next(new AppError(403, 'This feature requires a premium subscription.'));
    return;
  }
  next();
}
