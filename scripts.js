function add(element) {
    var parent = element.parentNode
    var cloned = $(parent.querySelector('.input-group')).clone()[0]
    cloned.style.removeProperty('display');
    var input = cloned.querySelector('input');
    input.removeAttribute('disabled');
    element.before(cloned);
    var settings = {};
    if (['quotes', 'texts', 'tags'].includes(input.name)) {
        settings.delimiters = /[, ]/
    }
    new Tagify(input, settings);
}
function del(element) {
    var inputGroup = element.parentNode.parentNode
    inputGroup.remove() 
}
function copy(element) {
    var inputGroup = element.parentNode.parentNode;
    var input = inputGroup.querySelector('input');
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
}
function addOneEach() {
    $('#addAny').click();
    $('#addQuote').click();
    $('#addText').click();
    $('#addTags').click();
}

function generate() {
    var form = document.getElementById('input');
    var query = [];
    
    // each URI is an OR
    var uris = eval(form.uris.value);
    if (uris) {
        for (uri of uris) {
            query.push('wildcard_uri=' + uri.value);
        }
    }

    // each URI is an OR
    var users = eval(form.users.value);
    if (users) {
        for (user of users) {
            query.push('user=' + user.value);
        }
    }

    // each group is an OR
    var groups = eval(form.groups.value);
    if (groups) {
        for (group of groups) {
            query.push('group=' + group.value);
        }
    }

    // within an anys field, each any is an OR
    // but each anys is an AND
    var anys = form.querySelectorAll('input[name=anys]')
    for (any of anys) {
        any = eval(any.value);
        if (any) {
            any = any.map(item => '"' + item.value + '"');
            query.push('any=' + any.join('|'))
        }
    }

    // within a quotes field, each quote is an OR
    // but each quotes is an AND
    var quotes = form.querySelectorAll('input[name=quotes]')
    for (quote of quotes) {
        quote = eval(quote.value);
        if (quote) {
            quote = quote.map(item => item.value);
            query.push('quote=' + quote.join('|'))
        }
    }

    // within a texts field, each text is an OR
    // but each texts is an AND
    var texts = form.querySelectorAll('input[name=texts]')
    for (text of texts) {
        text = eval(text.value);
        if (text) {
            text = text.map(item => item.value);
            query.push('text=' + text.join('|'))
        }
    }

    // within a tags field, each tag is an OR
    // but each tags is an AND
    var tags = form.querySelectorAll('input[name=tags]')
    for (tag of tags) {
        tag = eval(tag.value);
        if (tag) {
            tag = tag.map(item => item.value);
            query.push('tag=' + tag.join('|'))
        }
    }

    query = query.join('&');
    var output = document.getElementById('output')
    output.rss.value = 'https://hypothes.is/stream.rss?' + query
    output.atom.value = 'https://hypothes.is/stream.atom?' + query
}

function getFeed(url) {
    // https://github.com/hongkiat/js-rss-reader/
    fetch(url).then((res) => {
        res.text().then((xmlTxt) => {
            var domParser = new DOMParser()
            let doc = domParser.parseFromString(xmlTxt, 'text/xml')
            doc.querySelectorAll('item').forEach((item) => {
                let h1 = document.createElement('h1')
                h1.textContent = item.querySelector('title').textContent
                document.getElementById('feed').appendChild(h1)
            })
        })
    })
}