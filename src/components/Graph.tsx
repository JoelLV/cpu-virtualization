import { Bar } from 'react-chartjs-2'

const Graph = () => {
    return (
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
                        text: 'Process Scheduling Visualization',
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
                ],
            }}
        />
    )
}

export default Graph
