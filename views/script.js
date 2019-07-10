/* global fetch, Chart */
window.onload = async () => {
  let data = await fetch('/store').then(j => j.json())
  let ctx = document.getElementById('canvas').getContext('2d')
  let people = []; let chars = []; let words = []; let times = []
  for (let id in data) {
    people.push(data[id].name)
    chars.push(data[id].track.chars)
    words.push(data[id].track.words)
    times.push(data[id].track.times)
  }
  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: people,
      datasets: [
        {
          label: 'Characters',
          data: chars,
          backgroundColor: '#2d3561'
        },
        {
          label: 'Words',
          data: words,
          backgroundColor: '#f3826f'
        },
        {
          label: 'Amount',
          data: times,
          backgroundColor: '#ffb961'
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{ ticks: { beginAtZero: true } }]
      }
    }
  })
  let style = chart.canvas.parentNode.style
  style.height = '200px'
  style.width = '80%'
  style.margin = '100px auto'
}
