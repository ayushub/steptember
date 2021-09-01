//SET THE BELOW PARAMS

const username = '';
const password = ''
const steps = 0;
const day = 02;

//DO NOT EDIT ANYTHING BELOW THIS LINE
const axios = require('axios')
const url = require('url');
const setCookie = require('set-cookie-parser');
const parse = require('node-html-parser');

var coos = '';
const params = new url.URLSearchParams();
params.append('login_email', username);
params.append('login_password', password);

axios
  .post('https://www.steptember.org.au/login', params, 
    {headers: {'content-type': 'application/x-www-form-urlencoded'} })
  .then(res => {
    var cookies = setCookie.parse(res, {
        decodeValues: true  // default: true
      });
    
    cookies.forEach(coo => {
        coos += coo.name + '=' + coo.value + ';';
    });
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)

    axios.get('https://www.steptember.org.au/login/activity', {headers: {'cookie': coos}})
        .then(res => {
            const from = res.data.indexOf('<table id="data-table"');
            const to = res.data.indexOf('</table>',from);
            const root = parse.parse(res.data.substring(from, to));
            console.log(root.innerText);
        }).catch(error => {
            console.error(error)
          })

    if(steps > 0){
        const activity = new url.URLSearchParams();
        activity.append('date_from', '2021-09-' + day);
        activity.append('steps', steps);
        activity.append('activity_type', 'manual');
        activity.append('duration', '');
        activity.append('m_target_steps', 0);
        activity.append('date_from_edit', '2021-09-02');

        axios
        .post('https://www.steptember.org.au/login/activity', activity,
        {headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': coos
        } })
        .then(res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
            axios.get('https://www.steptember.org.au/login/activity', {headers: {'cookie': coos}})
                .then(res => {
                    const from = res.data.indexOf('<table id="data-table"');
                    const to = res.data.indexOf('</table>',from);
                    const root = parse.parse(res.data.substring(from, to));
                    console.log(root.innerText);
                }).catch(error => {
                    console.error(error)
                })
        })
        .catch(error => {
        console.error(error)
        })
    }

  })
  .catch(error => {
    console.error(error)
  })