function endpoint(app, connpool) {

    app.post("/api/veterinario", (req, res) => {
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
            id_vet: req.body.id_vet,
            nome: req.body.nome,
            cognome: req.body.cognome,
            dataN: req.body.dataN,
        }

        var sql = 'INSERT INTO veterinario (id_vet, nome, cognome, dataN) VALUES (?, ?, ?, ?)'
        var params = [data.id_vet, data.nome, data.cognome, data.dataN];
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



    app.get("/api/veterinario", (req, res, next) => {
        var sql = "select * from veterinario"
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


    app.get("/api/veterinario/:id", (req, res) => {
        var sql = "select * from veterinario where id_vet = 1"
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


    app.put("/api/veterinario/:id", (req, res) => {
        var data = {
            id_vet: req.body.id_vet,
            nome: req.body.nome,
            cognome: req.body.cognome,
            dataN: req.body.dataN,
        }
        connpool.execute(
            `UPDATE veterinario set 
               nome = COALESCE(?,nome), 
               cognome = COALESCE(?,cognome)
               dataN = COALESCE(?,dataN) 
               WHERE id_vet =1`,
            [data.id_vet, data.nome, data.cognome, data.dataN, req.params.id],
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



    app.delete("/api/veterinario/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM veterinario WHERE id_vet =1',
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