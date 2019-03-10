import { elements } from '../views/base';
import MarfeelWidget from '../components/MarfeelWidget';

// clear the View
export const clearResults = () => {
    elements.body.innerHTML = '';
};

// Render app
export const renderApp = (statData) => {
    const markup = `
    <div class="widget-items">
        <div class="widget-item"></div>
    </div>
`;
    elements.body.innerHTML = markup;

    // append as many widgets to the element as there are object within
    statData.forEach((data) => {
        const widget = document.createElement('marfeel-widget');
        widget.widgetData = data;
        widget.setAttribute("type", data.title.toLowerCase());
        document.querySelector('.widget-item').append(widget);
    });
};

