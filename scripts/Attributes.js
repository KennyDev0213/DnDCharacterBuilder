var proficiency_bonus = 0

var attributes_bonus = {
    "str" : 0,
    "dex" : 0,
    "con" : 0,
    "int" : 0,
    "wis" : 0,
    "cha" : 0
}

var attribute_names = {
    "str" : "Strength",
    "dex" : "Dexterity",
    "con" : "Constitution",
    "int" : "Intelligence",
    "wis" : "Wisdom",
    "cha" : "Charisma"
}

calcBonus = (stat) => {
    if(stat <= 1)
        return  -5
    else if(stat <= 3)
        return  -4
    else if(stat <= 5)
        return -3
    else if(stat <= 7)
        return  -2
    else if(stat <= 9)
        return  -1
    else if(stat <= 11)
        return  0    
    else if(stat <= 13)
        return  1  
    else if(stat <= 15)
        return  2
    else if(stat <= 17)
        return  3  
    else if(stat <= 19)
        return  4  
    else if(stat <= 21)
        return  5
    else if(stat <= 23)
        return  6 
    else if(stat <= 25)
        return  7
    else if(stat <= 27)
        return  8 
    else if(stat <= 29)
        return  9 
    else if(stat >= 30)
        return  10 
}

reroll = (attr) => {
    const num = Math.floor(Math.random() * 20) + 1
    let row_id = attr + "-row"
    //update the roll number
    document.getElementById(row_id).children[1].firstChild.value = num
    //update any related skill bonuses
    update_bonus(attr, num)
}

update_bonus = (attr, val) => {
    let class_id = attr + "-skill"
    let bonus = calcBonus(val)

    //reset bonus in attribute table and saving throws bonuses
    let row_id = attr + "-row"
    let label = document.getElementById(row_id).children[2]
    label.innerHTML = bonus

    //reset all the bonuses for skills
    let bonus_skills = document.getElementsByClassName(class_id)
    for(const i in bonus_skills){
        bonus_skills[i].innerHTML = bonus
        try {
            bonus_skills[i].innerHTML = bonus + parseInt(bonus_skills[i].dataset.modifier)
        } catch (Exception) {
            //console.log("could not find proficient modifier in " + bonus_skills[i] + " Exception: " + Exception)
            continue
        }
    }

    //update attribute_bonus dict
    //attributes_bonus[attr] = bonus
}

update_proficiency_bonus = (value) => {
    proficiency_bonus = value
    document.getElementById("p_value").innerHTML = "Proficiency Bonus: " + proficiency_bonus
} 

update_proficiency = (id, checkbox) => {
    var val_box = document.getElementById(id)
    if(typeof val_box !== 'undefined'){
        var val = val_box.innerHTML
        if(checkbox.checked){
            val_box.dataset.modifier = proficiency_bonus
            val_box.innerHTML = parseInt(val) + proficiency_bonus
        }
        else{
            val_box.innerHTML = parseInt(val) - proficiency_bonus
            val_box.dataset.modifier = 0
        }
    }
}

gen_attribute_table = () => {

    let table_body = document.createElement("tbody")

    for(const attr in attributes_bonus){
        //the encompassing row
        let new_row = document.createElement("tr")
        new_row.id = attr + "-row"

        //the label
        let new_label = document.createElement("td")
        new_label.innerHTML = attribute_names[attr]
        new_label.className = "attr-label"
        new_row.appendChild(new_label)

        //the number input
        let new_input = document.createElement("td")
        new_input.className = "attr-value"
        let number_input = document.createElement("input")
        number_input.type = "number"
        number_input.value = 0
        number_input.setAttribute("onchange", "update_bonus(\'"+attr+"\',value)")
        new_input.appendChild(number_input)
        new_row.appendChild(new_input)

        //the calculated bonus
        let new_bonus = document.createElement("td")
        new_bonus.id = attr + "-bonus"
        new_bonus.innerHTML = 0
        new_row.appendChild(new_bonus)

        //the re-roll button
        let new_button = document.createElement("td")
        let btn = document.createElement("input")
        btn.type = "button"
        btn.value = "Re-Roll"
        btn.setAttribute("onclick", "reroll(\'"+attr+"\')")
        new_button.appendChild(btn)
        new_row.appendChild(new_button)

        table_body.appendChild(new_row)
    }

    return table_body
}

gen_saves_table = () => {
    let table_body = document.createElement("tbody")

    for(const attr in attributes_bonus){
        //gen row
        let new_row = document.createElement("tr")
        new_row.id = attr + "-save-row"

        //gen label
        let save_label = document.createElement("td")
        save_label.innerHTML = attribute_names[attr]
        new_row.appendChild(save_label)

        //gen value label
        let saves_value = document.createElement("td")
        saves_value.className = attr + "-skill"
        var save_id = attr+"-save"
        saves_value.id = save_id
        saves_value.setAttribute("data-modifier", 0)
        new_row.appendChild(saves_value)

        //gen proficiency bod
        let saves_check = document.createElement("td")
        let saves_input = document.createElement("input")
        saves_input.type = "checkbox"
        saves_input.setAttribute("onchange", 'update_proficiency(\"'+save_id+'\", this)')
        new_row.appendChild(saves_input)
        new_row.appendChild(saves_check)

        table_body.appendChild(new_row)
    }

    return table_body
}

gen_spell_table = () => {
    let body = document.createElement("tbody")
    
    for(let i = 0; i < 10; i++){
        let row = document.createElement("tr")
        row.id = "spell" + i +"-row"

        let label = document.createElement("td")
        label.className = "spell-level-label"
        label.innerHTML = "level "+i
        row.appendChild(label)

        let sbox = document.createElement("td")
        sbox.id = "spell"+i+"-box"
        row.appendChild(sbox)

        body.appendChild(row)
    }
    
    //spell level 0 are called 'cantrips' in DnD
    body.children[0].children[0].innerHTML = "Cantrips" 


    return body
}

init_attribute_tables = () =>{
    update_proficiency_bonus(2)
    //generate the attribute tbody and append to the attribute table
    var attr_table_body = gen_attribute_table()
    document.getElementById("attribute-table").appendChild(attr_table_body)

    //generate the saves tbody and append the saves table 
    var saves_table_body = gen_saves_table()
    document.getElementById("saves-table").appendChild(saves_table_body)

    //generate the spell table
    var spell_table_body = gen_spell_table()
    document.getElementById("spell-table").appendChild(spell_table_body)

    //update the data in the attribute table
    attr_table_children = attr_table_body.children
    for(let i = 0; i < attr_table_children.length; i++){
        let stat = attr_table_children[i].id.split("-")[0]
        update_bonus(stat, attr_table_children[i].children[1].firstChild.value)
        }
}