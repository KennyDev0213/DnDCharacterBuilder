const base_url = "https://www.dnd5eapi.co"
const race_url = base_url + "/api/races"
const class_url = base_url + "/api/classes"
const background_url = base_url + "/api/backgrounds"

var race_selector = document.getElementById("race-select")
var class_selector = document.getElementById("class-select")
var background_selector = document.getElementById("background-select")

var race_json
var background_json

update_selector = (array, selector) => {
    document.createElement("option")

    array.forEach(elem => {
        var new_option = document.createElement("option")
        new_option.value = "/" + elem.index
        new_option.innerHTML = elem.name
        selector.appendChild(new_option)
    })
}

init_data = () => {

    race_selector = document.getElementById("race-select")
    class_selector = document.getElementById("class-select")
    background_selector = document.getElementById("background-select")

    fetch(race_url)
    .then(res => res.json())
    .then(data => {
        race_json = data
        update_selector(data.results, race_selector)
    })

    fetch(class_url)
    .then(res => res.json())
    .then(data => {
        class_json = data
        update_selector(data.results, class_selector)
    })

    fetch(background_url)
    .then(res => res.json())
    .then(data => {
    background_json = data
    update_selector(data.results, background_selector)
    })

}

update_race = () =>{
    let name = race_selector.value
    let race_index = race_url + name

    fetch(race_index)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        race_json = data

        let list = document.getElementById("trait-list")

        //remove all children from list
        let race_traits = document.getElementsByClassName("race-trait")
        while(race_traits.length != 0){
            list.removeChild(race_traits.item(0))
            race_traits = document.getElementsByClassName("race-trait")
        }
        
        //add new items to the list
        data.traits.forEach(elem =>{
            let point = document.createElement("li")
            point.className = "race-trait"
            point.innerHTML = elem.name
            list.append(point)
        })
    })

}

reset_spells = () => {
    for(let i = 0; i < 10; i++){
        const select_id = "spell"+i+"-box"
        var box = document.getElementById(select_id)
        var children = box.children
        while(children.length != 0){
            box.removeChild(box.lastChild)
            children = box.children
        }
    }
}

update_spells = (spell_url) => {
    //build the url to fetch
    let spell_uri = base_url + spell_url
    fetch(spell_uri).then(res => res.json()).then(data => {
        //for every spell that is shown, fetch the corresponding url and fetch it
        for(const spell in data.results){
            const spell_uri = base_url + data.results[spell].url
            //this is the data for every individual spell
            fetch(spell_uri).then(res => res.json()).then(data3 => {

                const select_id = "spell-selector-level"+ data3.level
                const selects = document.getElementsByClassName(select_id)

                if(selects.length != 0){
                    for(let i = 0; i < selects.length; i++){

                        //console.log(selects[i])

                        let option = document.createElement("option")
                        option.innerHTML = data3.name

                        selects[i].appendChild(option)
                    }
                }
                
            })
        }
    })
}

gen_spell_options = (spell_casting) => {
    var count = 0
    for(const spell_index in spell_casting){
        //console.log(number)
        if(spell_casting[spell_index] != 0 && spell_index != "spells_known"){
            var box_id = "spell" + count + "-box"
            var box = document.getElementById(box_id)
            for(let i = 0; i < spell_casting[spell_index]; i++){
                var new_spell = document.createElement("select")
                new_spell.className = "spell-selector-level" + count
                box.appendChild(new_spell)
            }
        }
        count++  
    }
}

update_class = () => {

    reset_spells()

    let class_name = class_selector.value
    let class_index = class_url + class_name

    let level = document.getElementById("level-select").value

    fetch(class_index)
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("equipment-list")

        let start_equip = data.starting_equipment

        //setup the class level
        let level_uri = class_url + class_name + "/levels/" + level
        //console.log(level_uri)
        fetch(level_uri).then(res => res.json()).then(info => {
            //console.log(info)

            gen_spell_options(info.spellcasting)

            //spells
            if (data.hasOwnProperty('spells')){
                var spell_data = data.spellcasting.spellcasting_ability
                document.getElementById("spell-attr").innerHTML = attribute_names[spell_data.index]
                update_spells(data.spells)
            }
        })

        //remove all children from list
        let equipment = document.getElementsByClassName("class-item")
        while(equipment.length != 0){
            list.removeChild(equipment.item(0))
            equipment = document.getElementsByClassName("class-item")
        }

        //default starting equipment
        start_equip.forEach(e => {
            let point = document.createElement("li")
            point.className = "class-item"
            point.innerHTML = e.equipment.name
            list.append(point)
        })

        //choice starting equipment
        let choice_equip = data.starting_equipment_options
        choice_equip.forEach(e => {
            let point = document.createElement("li")
            point.className = "class-item"
            let select = document.createElement("select")

            //WIP
            /*
            e.from.forEach(c => {
                let option = document.createElement("option")
                option.innerHTML = c.equipment.name
                select.appendChild(option)
            })
            */
            point.appendChild(select)
            list.append(point)
        })
    })
}