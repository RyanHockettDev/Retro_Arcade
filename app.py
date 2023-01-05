from flask import Flask, render_template, flash, request, redirect, url_for, session, logging
import sqlite3
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt

app = Flask(__name__)
app.config['SECRET_KEY'] = "Your_secret_string"

def name_check(s):
    if "name" in s:
        name = s["name"]
    else:
        name = "Player One"
    return name

@app.route("/", methods=["GET", "POST"])
def index():
    player = name_check(session)
    conn = sqlite3.connect("retro_arcade.db")
    cur = conn.cursor()
    g = cur.execute("SELECT game_name, preview_image, description FROM games")
    games = g.fetchall()
    cur.close()

    return render_template("index.html", player=player, games=games)

@app.route("/login", methods=["GET", "POST"])
def login():
    player = name_check(session)
    if "name" in session:
        flash("You are already logged in!", "success")
        return redirect(url_for("profile"))
    if request.method == "POST":
        name = request.form["name"]
        password_entered = request.form["password"]

        conn = sqlite3.connect("retro_arcade.db")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        result = cur.execute("SELECT password FROM users WHERE name = ?", (name,))
        data = cur.fetchone()
        if data != None:
            password = data["password"]

            if sha256_crypt.verify(password_entered, password):
                session["logged_in"] = True
                session["name"] = name
                flash("You are now logged in!", "success")
                return redirect(url_for("profile"))
            else:
                flash("Sorry, invalid login!", "danger")
            cur.close()
        else:
            flash("Sorry, username not found!", "danger")
        cur.close()

    return render_template("login.html", player=player)

@app.route("/register", methods=["GET", "POST"])
def register():
    player = name_check(session)
    form = RegisterForm(request.form)

    if request.method == "POST" and form.validate():
        name = form.name.data
        password = sha256_crypt.hash(str(form.password.data))
        conn = sqlite3.connect("retro_arcade.db")
        cur = conn.cursor()
        userCheck = cur.execute("SELECT id FROM users WHERE name = ?", (name,))
        result = cur.fetchone()

        if result == None:
            cur.execute("INSERT INTO users (name, password) VALUES(?, ?)", (name, password))
            conn.commit()

            flash("You are now registered and can log in!", "success")

            return redirect(url_for("login"))
        else:
            flash("Sorry, that username is already in use!", "danger")
        cur.close()

    return render_template("register.html", form=form, player=player)

@app.route("/profile")
def profile():
    if "name" in session:
        player = session["name"]
        conn = sqlite3.connect("retro_arcade.db")
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE name = ?", (player,))
        user_id = cur.fetchone()[0]

        cur.execute("SELECT * FROM hiscores WHERE id = ?", (user_id,))
        scores = cur.fetchone()

        if scores == None:
            flash("You have no scores to display! Go play some games!", "warning")
            cur.close()
            return render_template("profile.html", player=player)
        else:
            cur.execute("SELECT ROW_NUMBER() OVER (PARTITION BY game_id ORDER BY hiscore DESC) RowNum, id, game_id, hiscore FROM hiscores")
            scores = cur.fetchall()
            scores_list = []
            game_names = []

            for i in range(len(scores)):
                if scores[i][0] == user_id:
                    scores_list.append(scores[i])

            for i in range(len(scores_list)):
                gameId = scores_list[i][2]
                cur.execute("SELECT game_name FROM games WHERE game_id = ?", (gameId,))
                gameName = cur.fetchone()[0]
                game_names.append(gameName)

            cur.close()
            return render_template("profile.html", player=player, scores_list=scores_list, game_names=game_names)
    else:
        flash("Log in to access your profile!", "info")
        return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.pop("name", None)
    session["logged_in"] = False
    flash("You are now logged out", "info")
    return redirect(url_for("login"))

@app.route("/SNAKE!", methods=["GET", "POST"])
def snake():
    if "name" in session:
        name = session["name"]

        conn = sqlite3.connect("retro_arcade.db")
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE name = ?", (name,))
        userId = cur.fetchone()[0]

        cur.execute("SELECT game_id FROM games WHERE game_name = 'SNAKE!'")
        gameId = cur.fetchone()[0]

        cur.execute("SELECT hiscore FROM hiscores WHERE id = ? AND game_id = ?", (userId, gameId,))
        hiscoreDB = cur.fetchone()

        if request.method == "POST":
            hiscore = int(request.form["hiscore"])
            if hiscoreDB == None:
                newScore = "INSERT INTO hiscores (id, game_id, hiscore) VALUES(?,?,?)"
                cur.execute(newScore, (userId, gameId, hiscore))
                conn.commit()
                return render_template("snake.html", hiscore=hiscore)
            elif hiscoreDB[0] < hiscore:
                cur.execute("UPDATE hiscores SET hiscore = ? WHERE id = ? AND game_id =?", (hiscore, userId, gameId,))
                conn.commit()
                return render_template("snake.html", hiscore=hiscore)
            else:
                return render_template("snake.html", hiscore=hiscore)
        else:
            if hiscoreDB == None:
                return render_template("snake.html")
            else:
                hiscore = hiscoreDB[0]
                return render_template("snake.html", hiscore=hiscore)

        cur.close()

    else:
        return render_template("snake.html")

@app.route("/Typing Game", methods=["GET", "POST"])
def typingGame():
    name = session["name"]

    conn = sqlite3.connect("retro_arcade.db")
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE name = ?", (name,))
    userId = cur.fetchone()[0]

    cur.execute("SELECT game_id FROM games WHERE game_name = 'Typing Game'")
    gameId = cur.fetchone()[0]

    cur.execute("SELECT hiscore FROM hiscores WHERE id = ? AND game_id = ?", (userId, gameId,))
    hiscoreDB = cur.fetchone()

    if request.method == "POST":
        hiscore = int(request.form["hiscore"])        
        if hiscoreDB == None:
            cur.execute("INSERT INTO hiscores (id, game_id, hiscore) VALUES(?,?,?)", (userId, gameId, hiscore))
            conn.commit()
            return render_template("typingGame.html", hiscore=hiscore)
        elif hiscoreDB[0] < hiscore:
            updateScore = "UPDATE hiscores SET hiscore = ? WHERE id = ? AND game_id =?"
            cur.execute(updateScore, (hiscore, userId, gameId,))
            conn.commit()
            return render_template("typingGame.html", hiscore=hiscore)
        else:
            return render_template("typingGame.html", hiscore=hiscore)
    else:
        if hiscoreDB == None:
            return render_template("typingGame.html")
        else:
            hiscore = hiscoreDB[0]
            return render_template("typingGame.html", hiscore=hiscore)
    cur.close()
    

@app.route("/leaderboard")
def leaderboard():
    player = name_check(session)

    scores_all = []
    names = []
    names_all = []

    conn = sqlite3.connect("retro_arcade.db")
    cur = conn.cursor()

    cur.execute("SELECT game_id, game_name FROM games")
    games = cur.fetchall()

    for i in range(len(games)):
        g = games[i][0]
        cur.execute("SELECT ROW_NUMBER() OVER (ORDER BY hiscore) RowNum, id, hiscore FROM hiscores WHERE game_id = ?", (g,))
        score = cur.fetchall()
        scores_all.append(score)
        for i in range(len(score)):
            s = score[i][0]
            cur.execute("SELECT name FROM users WHERE id = ?", (s,))
            n = cur.fetchone()
            names.append(n)
        names_all.append(names)
    cur.close()

    return render_template("leaderboard.html", player=player, scores_all=scores_all, names_all=names_all, games=games)

class RegisterForm(Form):
    name = StringField("NAME:", [
        validators.Length(min=4, max=12),
        validators.InputRequired()])
    password = PasswordField("PASSWORD:", [
        validators.InputRequired(),
        validators.Length(min=8, max=16),
        validators.EqualTo("confirm", message="Passwords do not match")
    ])
    confirm = PasswordField("CONFIRM PASSWORD:")

if __name__ == "__main__":
    app.run()