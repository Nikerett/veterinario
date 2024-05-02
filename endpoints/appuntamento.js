function endpoint(app, connpool) {

    app.post("/api/appuntamenti", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.dataOra) {
            errors.push("No dataOra specified");
        }
        if (!req.body.idAnimale) {
            errors.push("No idAnimale specified");
        }
        if (!req.body.idVeterinario) {
            errors.push("No idVeterinario specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            dataOra: req.body.dataOra,
            idAnimale: req.body.idAnimale,
            idVeterinario: req.body.idVeterinario,
        }

        var sql = 'INSERT INTO appuntamenti (dataOra, idAnimale, idVeterinario) VALUES (?,?,?)'
        var params = [data.dataOra, data.idAnimale, data.idVeterinario]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "idAppuntamento": result.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/tasks", (req, res, next) => {
        var sql = "select * from task"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/tasks/:id", (req, res) => {
        var sql = "select * from task where task_id = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/tasks/:id", (req, res) => {
        var data = {
            description: req.body.description,
            status: req.body.status,
        }
        connpool.execute(
            `UPDATE task set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE task_id = ?`,
            [data.description, data.status, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/appuntamento/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM appuntamento WHERE idAppuntamento = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;