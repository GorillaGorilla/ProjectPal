/**
 * Created by frederickmacgregor on 28/08/2016.
 */


require("angular");
require("angular-resource");
require("angular-route");
require("Chart.js");
require("angular-chart.js");
require("./articles/articles.client.module.js");
require("./articles/controllers/articles.client.controller.js");
require("./articles/services/articles.client.service.js");
require("./articles/config/articles.client.routes.js");
require("./blusers/blusers.client.module.js");
require("./blusers/services/authentication.client.service.js")
require("./example/example.client.module.js")
require("./example/config/example.client.routes.js")
require("./example/controllers/example.client.controller.js")
require("./blusers/controllers/users.client.controller.js")
require("./blusers/services/users.client.service.js")
require("./blusers/config/users.client.routes.js")
require("./friends/friends.client.module.js")
require("./friends/controllers/friends.client.controller.js")
require("./friends/services/friends.client.service.js")
require("./friends/services/pendingfriends.client.service.js")
require("./friends/config/friends.client.routes.js")
require("./interactions/interactions.client.module.js")
require("./interactions/controllers/interactions.client.controller.js")
require("./interactions/services/interactions.client.service.js")
require("./interactions/config/interactions.client.routes.js")
require("./application.js")
require("./chat/chat.client.module.js")
require("./chat/services/socket.client.service.js")
require("./chat/controllers/chat.client.controller.js")
require("./chat/config/chat.client.routes.js")