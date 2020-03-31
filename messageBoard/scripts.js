let list = [];

$.ajax({
    method: 'GET',
    url: 'https://next-message-board.herokuapp.com/messages',
    success: function (info) {
        $('main').html('');
        info.forEach((item, index) => {
            $('main').append(`
                <div class = 'msgBlock' id = '${item.id}'>
                    <div class = 'messages'>
                     ${item.text}
                     </div>
                    <div class = 'moment'>
                    ${moment(item.created_at).format('MMMM D, YYYY - h:mmA')}
                    </div>
                </div>
            `)
            list.push(item.id);
        })
        deletus();
    },
    beforeSend: () => {
        $('main').html(`<div class="dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>`)
    },
    error: function (error) { console.log(error) }
})

function update() {
    $.ajax({
        method: 'GET',
        url: 'https://next-message-board.herokuapp.com/messages',
        success: function (info) {
            // reverse array before prepending to ensure correct sequence of messages.
            revInfo = info.reverse();
            revInfo.forEach((item, index) => {
                if (!list.includes(item.id)) {
                    $('main').prepend(`
                    <div class = 'msgBlock' id = '${item.id}'>
                        <div class = 'messages'>
                        ${item.text}
                        </div>

                        <div class = 'moment'>
                        ${moment(item.created_at).format('MMMM D, YYYY - h:mmA')}
                        </div>
                    </div>
                    `)
                    list.push(item.id)
                    deletus();
                }
            })
        },
        error: function (error) { console.log(error) }
    })
    console.log('update ran')
}
$('button').click(() => {
    console.log($('textarea'))
    let newMsg = document.createElement('div');
    newMsg.innerHTML = document.querySelector('textarea').value;
    $.ajax({
        method: 'post',
        url: 'https://next-message-board.herokuapp.com/messages',
        data: {
            text: `${newMsg.innerHTML}`
        },
        success: function (data) {
            console.log(data)
        },
        error: function (error) {
            console.log(error)
        }
    });
    document.querySelector('textarea').value = '';
    setTimeout(() => {
        update();
    }, 500);
})

deletus = () => {
    $('.msgBlock').each((index, message) => {
        console.log(message)
        message.addEventListener('click', () => {
            console.log('deleted')
            messageID = message.id
            $.ajax({
                method: 'post',
                url: `https://next-message-board.herokuapp.com/messages/delete/${messageID}`,
                success: function (data) {
                    console.log(data)
                },
                error: function (error) { console.log(error) }
            })
            message.remove()
        })
    })
}