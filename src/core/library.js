export let Classes = {};

export const getClassByNamespace = function(namespace) {
    var space, action, area;
    space = namespace.split('.');
    namespace = Classes;
    action = space.pop();
    while ((area = space.shift())) {
        namespace = namespace[area];
    }
    return namespace[action];
};

const ClassLibrary = {
    getClassByNamespace
};

window.ClassLibrary = ClassLibrary;