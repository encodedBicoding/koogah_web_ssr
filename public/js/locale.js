window.onload = function () {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const {latitude, longitude} = pos.coords
        let res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCYPNv2kt9vLe4ApNolquwLE8TlMCBJLC0`,
        )
        res = await res.json()
        const country = res.plus_code.compound_code
          .split(',')[1]
          .toLowerCase()
          .trim()
        const host = window.location.host.trim()
        const path = window.location.pathname.trim()
        const search = window.location.search.trim()
        const redirect_host = [
          'koogah.com',
          'www.koogah.com',
          'https://koogah.com',
          'https://www.koogah.com',
          'http://koogah.com',
          'http://www.koogah.com',
        ]
        if (country == 'nigeria') {
          if (redirect_host.includes(host)) {
            window.location.href = `https://www.koogah.com/${path}${search}`
          }
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }
}
