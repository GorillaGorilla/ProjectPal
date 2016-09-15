/**
 * Created by frederickmacgregor on 15/09/2016.
 */
var middleware = module.exports,
    url = require("url");

var HTTP = "http:",
    HTTPS = "https:";

middleware.transportSecurity = function () {

    var applicationURL = config().appURL(),
        scheme = url.parse(applicationURL).protocol;

    function securityEnabled () {
        if (scheme !== HTTP && scheme !== HTTPS) {
            throw new Error(
                "The application URL scheme must be 'http' or 'https'."
            );
        }
        return scheme === HTTPS;
    }

    function redirectURL (request) {
        return url.resolve(applicationURL, request.originalUrl);
    }

    if (securityEnabled()) {
        console.log("Transport security is enabled.");
    }

    return function (request, response, next) {
        // handling non-standard proxy headers ibm cf uses
        if(request.headers.protocol) {
            request.headers["x-forwarded-proto"] = request.headers.protocol;
        } else
        if(request.headers.$wssc) {
            // The $wssc header is something that WebSphere inserts to pass the
            // proxied protocol to downstream applications
            request.headers["x-forwarded-proto"] = request.headers.$wssc;
        }

        if (securityEnabled() && !request.secure) {
            log.info("Redirecting insecure request for", request.originalUrl);
            response.redirect(301, redirectURL(request));
        }
        else {
            next();
        }
    };

};
