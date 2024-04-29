function endpoint(app, connpool) {

    app.post("/api/tasks", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            description: req.body.description,
            status: req.body.status,
        }

        var sql = 'INSERT INTO padrone (idpadrone, nome, cognome, dataN) VALUES (1, nikita, kelba, 2004-08-31)'
        var params = [data.nome, data.cognome, data.dataN]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/tasks", (req, res, next) => {
        var sql = "select * from padrone"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    });


    app.get("/api/tasks/:id", (req, res) => {
        var sql = "select * from padrone where idpadrone = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            })
        });
    });


    app.put("/api/padrone/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
            cognome: req.body.cognome,
            dataN: req.body.dataN,
        }
        connpool.execute(
            `UPDATE padrone set 
               nome = COALESCE(?,nome), 
               cognome = COALESCE(?,cognome) 
               dataN = COALESCE(?, dataN)
               WHERE idpadrone = ?`,
            [data.nome, data.cognome, data.dataN, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                console.log(result)
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
            });
    })



    app.delete("/api/padrone/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM padrone WHERE idpadrone = ?',
            [req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.json({ "message": "deleted", changes: result.affectedRows })
            });
    })


}





module.exports = endpoint;