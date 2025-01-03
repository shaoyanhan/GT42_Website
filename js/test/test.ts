// /**
//  * This example showcases sigma's reducers, which aim to facilitate dynamically
//  * changing the appearance of nodes and edges, without actually changing the
//  * main graphology data.
//  */
// import Graph from "graphology";
// import Sigma from "sigma";
// import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

// import data from "../../_data/data.json";

// export default () => {
//     // Retrieve some useful DOM elements:
//     const container = document.getElementById("sigma-container") as HTMLElement;
//     const searchInput = document.getElementById("search-input") as HTMLInputElement;
//     const searchSuggestions = document.getElementById("suggestions") as HTMLDataListElement;

//     // Instantiate sigma:
//     const graph = new Graph();
//     graph.import(data);
//     const renderer = new Sigma(graph, container);

//     // Type and declare internal state:
//     interface State {
//         hoveredNode?: string;
//         searchQuery: string;

//         // State derived from query:
//         selectedNode?: string;
//         suggestions?: Set<string>;

//         // State derived from hovered node:
//         hoveredNeighbors?: Set<string>;
//     }
//     const state: State = { searchQuery: "" };

//     // Feed the datalist autocomplete values:
//     searchSuggestions.innerHTML = graph
//         .nodes()
//         .map((node) => `<option value="${graph.getNodeAttribute(node, "label")}"></option>`)
//         .join("\n");

//     // Actions:
//     function setSearchQuery(query: string) {
//         state.searchQuery = query;

//         if (searchInput.value !== query) searchInput.value = query;

//         if (query) {
//             const lcQuery = query.toLowerCase();
//             const suggestions = graph
//                 .nodes()
//                 .map((n) => ({ id: n, label: graph.getNodeAttribute(n, "label") as string }))
//                 .filter(({ label }) => label.toLowerCase().includes(lcQuery));

//             // If we have a single perfect match, them we remove the suggestions, and
//             // we consider the user has selected a node through the datalist
//             // autocomplete:
//             if (suggestions.length === 1 && suggestions[0].label === query) {
//                 state.selectedNode = suggestions[0].id;
//                 state.suggestions = undefined;

//                 // Move the camera to center it on the selected node:
//                 const nodePosition = renderer.getNodeDisplayData(state.selectedNode) as Coordinates;
//                 renderer.getCamera().animate(nodePosition, {
//                     duration: 500,
//                 });
//             }
//             // Else, we display the suggestions list:
//             else {
//                 state.selectedNode = undefined;
//                 state.suggestions = new Set(suggestions.map(({ id }) => id));
//             }
//         }
//         // If the query is empty, then we reset the selectedNode / suggestions state:
//         else {
//             state.selectedNode = undefined;
//             state.suggestions = undefined;
//         }

//         // Refresh rendering
//         // You can directly call `renderer.refresh()`, but if you need performances
//         // you can provide some options to the refresh method.
//         // In this case, we don't touch the graph data so we can skip its reindexation
//         renderer.refresh({
//             skipIndexation: true,
//         });
//     }
//     function setHoveredNode(node?: string) {
//         if (node) {
//             state.hoveredNode = node;
//             state.hoveredNeighbors = new Set(graph.neighbors(node));
//         }

//         if (!node) {
//             state.hoveredNode = undefined;
//             state.hoveredNeighbors = undefined;
//         }

//         // Refresh rendering
//         renderer.refresh({
//             // We don't touch the graph data so we can skip its reindexation
//             skipIndexation: true,
//         });
//     }

//     // Bind search input interactions:
//     searchInput.addEventListener("input", () => {
//         setSearchQuery(searchInput.value || "");
//     });
//     searchInput.addEventListener("blur", () => {
//         setSearchQuery("");
//     });

//     // Bind graph interactions:
//     renderer.on("enterNode", ({ node }) => {
//         setHoveredNode(node);
//     });
//     renderer.on("leaveNode", () => {
//         setHoveredNode(undefined);
//     });

//     // Render nodes accordingly to the internal state:
//     // 1. If a node is selected, it is highlighted
//     // 2. If there is query, all non-matching nodes are greyed
//     // 3. If there is a hovered node, all non-neighbor nodes are greyed
//     renderer.setSetting("nodeReducer", (node, data) => {
//         const res: Partial<NodeDisplayData> = { ...data };

//         if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
//             res.label = "";
//             res.color = "#f6f6f6";
//         }

//         if (state.selectedNode === node) {
//             res.highlighted = true;
//         } else if (state.suggestions) {
//             if (state.suggestions.has(node)) {
//                 res.forceLabel = true;
//             } else {
//                 res.label = "";
//                 res.color = "#f6f6f6";
//             }
//         }

//         return res;
//     });

//     // Render edges accordingly to the internal state:
//     // 1. If a node is hovered, the edge is hidden if it is not connected to the
//     //    node
//     // 2. If there is a query, the edge is only visible if it connects two
//     //    suggestions
//     renderer.setSetting("edgeReducer", (edge, data) => {
//         const res: Partial<EdgeDisplayData> = { ...data };

//         if (
//             state.hoveredNode &&
//             !graph.extremities(edge).every((n) => n === state.hoveredNode || graph.areNeighbors(n, state.hoveredNode))
//         ) {
//             res.hidden = true;
//         }

//         if (
//             state.suggestions &&
//             (!state.suggestions.has(graph.source(edge)) || !state.suggestions.has(graph.target(edge)))
//         ) {
//             res.hidden = true;
//         }

//         return res;
//     });

//     return () => {
//         renderer.kill();
//     };
// };


/**
 * This example shows how to use node and edges events in sigma.
 */
import Graph from "graphology";
import Sigma from "sigma";
import { MouseCoords } from "sigma/types";

import data from "../../_data/data.json";

export default () => {
    const container = document.getElementById("sigma-container") as HTMLElement;
    const logsDOM = document.getElementById("sigma-logs") as HTMLElement;

    const graph = new Graph();
    graph.import(data);

    function logEvent(event: string, itemType: "node" | "edge" | "positions", item: string | MouseCoords): void {
        const div = document.createElement("div");
        let message = `Event "${event}"`;
        if (item && itemType) {
            if (itemType === "positions") {
                item = item as MouseCoords;
                message += `, x ${item.x}, y ${item.y}`;
            } else {
                const label =
                    itemType === "node" ? graph.getNodeAttribute(item, "label") : graph.getEdgeAttribute(item, "label");
                message += `, ${itemType} ${label || "with no label"} (id "${item}")`;

                if (itemType === "edge") {
                    message += `, source ${graph.getSourceAttribute(item, "label")}, target: ${graph.getTargetAttribute(
                        item,
                        "label",
                    )}`;
                }
            }
        }
        div.innerHTML = `<span>${message}</span>`;
        logsDOM.appendChild(div);
        logsDOM.scrollTo({ top: logsDOM.scrollHeight });

        if (logsDOM.children.length > 50) logsDOM.children[0].remove();
    }

    let hoveredEdge: null | string = null;
    const renderer = new Sigma(graph, container, {
        enableEdgeEvents: true,
        edgeReducer(edge, data) {
            const res = { ...data };
            if (edge === hoveredEdge) res.color = "#cc0000";
            return res;
        },
    });

    const nodeEvents = [
        "enterNode",
        "leaveNode",
        "downNode",
        "clickNode",
        "rightClickNode",
        "doubleClickNode",
        "wheelNode",
    ] as const;
    const edgeEvents = ["downEdge", "clickEdge", "rightClickEdge", "doubleClickEdge", "wheelEdge"] as const;
    const stageEvents = ["downStage", "clickStage", "doubleClickStage", "wheelStage"] as const;

    nodeEvents.forEach((eventType) => renderer.on(eventType, ({ node }) => logEvent(eventType, "node", node)));
    edgeEvents.forEach((eventType) => renderer.on(eventType, ({ edge }) => logEvent(eventType, "edge", edge)));

    renderer.on("enterEdge", ({ edge }) => {
        logEvent("enterEdge", "edge", edge);
        hoveredEdge = edge;
        renderer.refresh();
    });
    renderer.on("leaveEdge", ({ edge }) => {
        logEvent("leaveEdge", "edge", edge);
        hoveredEdge = null;
        renderer.refresh();
    });

    stageEvents.forEach((eventType) => {
        renderer.on(eventType, ({ event }) => {
            logEvent(eventType, "positions", event);
        });
    });

    return () => {
        renderer.kill();
    };
};






// Retrieve some useful DOM elements:
const container = document.getElementById("sigma-container") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById("suggestions") as HTMLDataListElement;

// Instantiate sigma:
const graph = new Graph();
graph.import(data);
const renderer = new Sigma(graph, container);

// Type and declare internal state:
interface State {
    hoveredNode?: string;
    searchQuery: string;

    // State derived from query:
    selectedNode?: string;
    suggestions?: Set<string>;

    // State derived from hovered node:
    hoveredNeighbors?: Set<string>;
}
const state: State = { searchQuery: "" };

// Feed the datalist autocomplete values:
searchSuggestions.innerHTML = graph
    .nodes()
    .map((node) => `<option value="${graph.getNodeAttribute(node, "label")}"></option>`)
    .join("\n");

// Actions:
function setSearchQuery(query: string) {
    state.searchQuery = query;

    if (searchInput.value !== query) searchInput.value = query;

    if (query) {
        const lcQuery = query.toLowerCase();
        const suggestions = graph
            .nodes()
            .map((n) => ({ id: n, label: graph.getNodeAttribute(n, "label") as string }))
            .filter(({ label }) => label.toLowerCase().includes(lcQuery));

        // If we have a single perfect match, them we remove the suggestions, and
        // we consider the user has selected a node through the datalist
        // autocomplete:
        if (suggestions.length === 1 && suggestions[0].label === query) {
            state.selectedNode = suggestions[0].id;
            state.suggestions = undefined;

            // Move the camera to center it on the selected node:
            const nodePosition = renderer.getNodeDisplayData(state.selectedNode) as Coordinates;
            renderer.getCamera().animate(nodePosition, {
                duration: 500,
            });
        }
        // Else, we display the suggestions list:
        else {
            state.selectedNode = undefined;
            state.suggestions = new Set(suggestions.map(({ id }) => id));
        }
    }
    // If the query is empty, then we reset the selectedNode / suggestions state:
    else {
        state.selectedNode = undefined;
        state.suggestions = undefined;
    }

    // Refresh rendering
    // You can directly call `renderer.refresh()`, but if you need performances
    // you can provide some options to the refresh method.
    // In this case, we don't touch the graph data so we can skip its reindexation
    renderer.refresh({
        skipIndexation: true,
    });
}


function setHoveredNode(node?: string) {
    if (node) {
        state.hoveredNode = node;
        state.hoveredNeighbors = new Set(graph.neighbors(node));
    }

    if (!node) {
        state.hoveredNode = undefined;
        state.hoveredNeighbors = undefined;
    }

    // Refresh rendering
    renderer.refresh({
        // We don't touch the graph data so we can skip its reindexation
        skipIndexation: true,
    });
}

// Bind search input interactions:
searchInput.addEventListener("input", () => {
    setSearchQuery(searchInput.value || "");
});
searchInput.addEventListener("blur", () => {
    setSearchQuery("");
});

// Bind graph interactions:
renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
});
renderer.on("leaveNode", () => {
    setHoveredNode(undefined);
});

// Render nodes accordingly to the internal state:
// 1. If a node is selected, it is highlighted
// 2. If there is query, all non-matching nodes are greyed
// 3. If there is a hovered node, all non-neighbor nodes are greyed
renderer.setSetting("nodeReducer", (node, data) => {
    const res: Partial<NodeDisplayData> = { ...data };

    if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
        res.label = "";
        res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
        res.highlighted = true;
    } else if (state.suggestions) {
        if (state.suggestions.has(node)) {
            res.forceLabel = true;
        } else {
            res.label = "";
            res.color = "#f6f6f6";
        }
    }

    return res;
});

// Render edges accordingly to the internal state:
// 1. If a node is hovered, the edge is hidden if it is not connected to the
//    node
// 2. If there is a query, the edge is only visible if it connects two
//    suggestions
renderer.setSetting("edgeReducer", (edge, data) => {
    const res: Partial<EdgeDisplayData> = { ...data };

    if (
        state.hoveredNode &&
        !graph.extremities(edge).every((n) => n === state.hoveredNode || graph.areNeighbors(n, state.hoveredNode))
    ) {
        res.hidden = true;
    }

    if (
        state.suggestions &&
        (!state.suggestions.has(graph.source(edge)) || !state.suggestions.has(graph.target(edge)))
    ) {
        res.hidden = true;
    }

    return res;
});

return () => {
    renderer.kill();
};
