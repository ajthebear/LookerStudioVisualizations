(function dscc) {
    const drawViz = (data) => {
        // Extract data from Looker Studio
        const config = {
            phases: data.tables.DEFAULT.map(row => row.dimensions[0]),
            counts: data.tables.DEFAULT.map(row => row.metrics[0]),
            colors: ["#9467bd", "#d62728", "#2ca02c", "#d62728", "#2ca02c"],
            totalHeight: 500,
            circleSize: 40,
            markerConfig: {
                borderColor: "#000",
                borderWidth: 1,
                opacity: 0.9
            },
            textConfig: {
                font: {
                    size: 12,
                    color: "#000",
                    family: "Arial, sans-serif",
                    weight: "bold"
                },
                textFormat: "percentage"
            }
        };

        const calculatePercentages = (counts) => ({
            fromInitial: counts.map((count) => ((count / counts[0]) * 100).toFixed(1)),
            fromPrevious: counts.map((count, index) =>
                index === 0 ? "100" : ((count / counts[index - 1]) * 100).toFixed(1))
        });

        const percentages = calculatePercentages(config.counts);

        // Circle Data
        const circleData = {
            type: "scatter",
            mode: "markers+text",
            x: config.counts.map(() => -1),
            y: config.phases,
            marker: {
                size: config.circleSize,
                color: config.colors,
                opacity: config.markerConfig.opacity,
                line: {
                    color: config.markerConfig.borderColor,
                    width: config.markerConfig.borderWidth
                }
            },
            text: percentages.fromInitial.map((value) => `${value}%`),
            textposition: "middle center",
            hoverinfo: "skip",
            textfont: config.textConfig.font
        };

        // Funnel Data
        const funnelData = {
            type: "funnel",
            y: config.phases,
            x: config.counts,
            textinfo: "none",
            marker: {
                color: config.colors,
                line: { color: "#000", width: 1 }
            }
        };

        // Combined Layout
        const layout = {
            title: {
                text: "Custom Funnel Chart with Circles",
                font: { family: "Arial, sans-serif", size: 18, color: "#444" },
                x: 0.5
            },
            xaxis: {
                showgrid: false,
                zeroline: false,
                visible: false
            },
            yaxis: {
                autorange: "reversed",
                categoryorder: "array",
                categoryarray: config.phases,
                automargin: true,
                showgrid: false,
                zeroline: false
            },
            height: config.totalHeight,
            margin: { l: 50, r: 50, t: 50, b: 50 }
        };

        // Render Combined Chart
        Plotly.newPlot('chart-container', [circleData, funnelData], layout, { displayModeBar: false });
    };

    // Load Data
    dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
})();
