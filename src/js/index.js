import * as appView from './views/appView';
import Widget from "./models/Widget"

/**
 * App CONTROLLER
 */
const WidgetController = async () => {
    // // Render widgets
    const widget = new Widget();
    const data = await widget.getData();
    appView.clearResults();
    appView.renderApp(data);
};

/**
 * Event listeners
*/

// Get widgets on DOM load
document.addEventListener('DOMContentLoaded', () => WidgetController());
