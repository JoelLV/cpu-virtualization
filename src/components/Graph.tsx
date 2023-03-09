import { Bar } from 'react-chartjs-2'

const Graph = () => {
    return (
        <div className="graph-container">
            <Bar
                options={{
                    indexAxis: 'y' as const,
                    elements: {
                        bar: {
                            borderWidth: 2,
                        },
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right' as const,
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Horizontal Bar Chart',
                        },
                    },
                }}
                data={{
                    labels: ['he', 'llo', 'som', 'thing'],
                    datasets: [
                        {
                            label: 'D',
                            data: [1, 2, 3, 4],
                        },
                        {
                            label: 'Z',
                            data: [5, 2, 2, 5],
                        },
                    ],
                }}
            />
        </div>
    )
}

export default Graph
