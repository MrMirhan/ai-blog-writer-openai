from flask import Flask, render_template, request
import config
import blog
import string, os
from datetime import datetime

def page_not_found(e):
  return render_template('404.html'), 404


app = Flask(__name__)
app.config.from_object(config.config['development'])

app.register_error_handler(404, page_not_found)


@app.route('/', methods=["GET", "POST"])
def index():
    docs = []
    if request.method == 'POST':
        if 'form1' in request.form:
            prompt = request.form['blogTopic']
            blogT = blog.generateBlogTopics(prompt)
            folder = str(int(datetime.now().timestamp()))
            os.mkdir('./documents/'+folder)
            topics = blogT.split('\n')
            tlist = [x.split('.')[0] for x in topics]
            topiclist = []
            for topicstart in tlist:
                topic = [x.replace(topicstart+'.', '').lstrip() for x in topics if x.startswith(topicstart)][0]
                if len(topic) < 10: continue
                topiclist.append(topic)
            topiclist = [x for x in topiclist if not x == None or not x == "" or not x == "\n"]
            x = 1
            for topic in topiclist:
                Sections = blog.generateBlogSections(topic)
                sections = [x.replace('-', '').lstrip() for x in Sections.split('\n') if x.startswith("-")]
                topicdocument = []
                y = 1
                for section in sections:
                    if len(section) < 6 or 'conclusion' in section.lower(): continue
                    Expanded = blog.blogSectionExpander(section)
                    topicdocument.append('\n- '+str(y)+'. '+section+'\n'+Expanded)
                    y+=1
                document = "\n".join(topicdocument)
                title = topic
                topic = str(topic.translate(str.maketrans('', '', string.punctuation))).lower()
                topic = topic.replace(' ', '_')
                tts = os.listdir('./documents/'+folder+'/')
                if topic+'.txt' in tts: topic+="_"+str(int(datetime.now().timestamp()))
                doc = title+'\n\n'+document
                docs.append({'title': title, 'doc': doc})
                open('./documents/'+folder+'/'+topic+'.txt', 'a').write(doc)
                print(topic, x,"/",len(topiclist))
                x += 1
            blogTopicIdeas = f"{len(topiclist)} document is generated!"
            documents = docs
    return render_template('index.html', **locals())


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8888', debug=True)
