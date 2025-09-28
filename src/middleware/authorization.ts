import {services} from "@app/service";
import type {NextFunction, Request, Response} from "express";
import type {Service} from "@service/interface.ts";
import type {AuthService} from "@service/auth.ts";
import {errorResponse} from "@restApi/response.ts";
import {ErrorHandler} from "@helper/error.ts";

declare global {
    namespace Express {
        export interface Request {
            token?: string;
        }
    }
}

/**
 * Extracts Bearer token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The extracted token or null if invalid/missing
 */
function extractBearerToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
        return null;
    }

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    return match && match.length > 0 ? match[1]! : null;
}

/**
 * Validates the token using the auth service
 * @param authSvc - The authentication service instance
 * @param token - The token to validate
 * @throws ErrorHandler if token is invalid
 */
async function validateToken(authSvc: AuthService, token: string): Promise<void> {
    try {
        await authSvc.isTokenValid(token);
    } catch (error) {
        throw new ErrorHandler("unauthorized", null, 401);
    }
}

/**
 * Creates an authorization middleware with dependency injection
 * @param serviceContainer - The service container containing auth service
 * @returns Express middleware function for authorization
 */
export function createAuthorizationMiddleware(serviceContainer: { auth: AuthService }) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = extractBearerToken(req.headers.authorization);

            if (!token) {
                res.setHeader('WWW-Authenticate', 'Bearer');
                errorResponse(res, new ErrorHandler("unauthorized", null, 401));
                return;
            }

            await validateToken(serviceContainer.auth, token);

            // Attach token to request for downstream use
            req.token = token;
            
            next();
        } catch (error) {
            if (error instanceof ErrorHandler) {
                errorResponse(res, error);
            } else {
                errorResponse(res, new ErrorHandler("unauthorized", null, 401));
            }
        }
    };
}

// Lazy initialization for backward compatibility
let serviceCache: { auth: AuthService } | null = null;

/**
 * Authorization middleware with lazy service initialization
 * This maintains backward compatibility while allowing for dependency injection
 */
const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!serviceCache) {
        const servicesContainer = services();
        serviceCache = {
            auth: servicesContainer.auth as AuthService
        };
    }
    
    const middleware = createAuthorizationMiddleware(serviceCache);
    await middleware(req, res, next);
};

export default authorization;
