'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result  = await db.query(`
        select 
            OrderId as "Order Id" , 
            sum(UnitPrice * quantity) as "Order Total Price",
            round(sum(Discount * quantity)/sum(UnitPrice * quantity) * 100,3) as "Total Order Discount, %"
        from orderdetails
        group by Orderid
        order by OrderId desc 
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
    select 
        CustomerID as "CustomerId",
        CompanyName as "CompanyName"
    from customers
    where Country = "USA" AND Fax is NULL
    `)
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
    select 
        CustomerID as "Customer Id",
        Count(OrderID) as "Total number of Orders",
        Round(((Count(OrderID)*100)/(select count(*) from orders)),5) as "% of all orders"
    from orders
    group by CustomerID 
    order by Count(OrderID) desc,CustomerID
    `)
    return result[0]
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        select 
            ProductID as "ProductId",
            ProductName,
            QuantityPerUnit
        from products
        where ProductName rlike '^[ABCDEF]'
        order by ProductName;
    `)
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT 
            products.ProductName as "ProductName",
            categories.CategoryName as "CategoryName",
            suppliers.CompanyName as "SupplierCompanyName"
        FROM products 
        join suppliers ON products.SupplierID = suppliers.SupplierID
        join categories ON products.CategoryID = categories.CategoryID
        order by products.ProductName,suppliers.CompanyName
    `)
    return  result[0]
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT 
               fir.EmployeeID as "EmployeeId",
               CONCAT(fir.FirstName, ' ', fir.LastName) as "FullName",
               if(fir.ReportsTo is null, "-", (select CONCAT(FirstName, ' ', LastName) from employees where EmployeeID = fir.ReportsTo)) as "ReportsTo"
        FROM employees fir
        order by fir.EmployeeID
    `)
    return result[0]
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
    select 
        cat.CategoryName as "CategoryName",
        count(prod.CategoryID) as "TotalNumberOfProducts"
        from categories cat
        join products prod on prod.CategoryID = cat.CategoryID
        group by cat.CategoryID
        order by cat.CategoryName
    `)
    return result[0]
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT
            CustomerID as "CustomerID",
            ContactName as "ContactName"
        FROM customers 
        WHERE ContactName rlike '^F' and LOCATE('n',ContactName) = 4
    `)
    return result[0]
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
            ProductID as "ProductID",
            ProductName as "ProductName"
        FROM products WHERE Discontinued = 1
    `)
    return result[0]
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT
            ProductName as "ProductName",
            UnitPrice as "UnitPrice"
        FROM products WHERE UnitPrice >= 5  AND UnitPrice <= 15
        ORDER BY UnitPrice,ProductName
    `)
    return result[0]
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        (SELECT
            ProductName as "ProductName",
            UnitPrice as "UnitPrice"
        FROM products
        ORDER BY UnitPrice DESC,ProductName
        LIMIT 20)
        ORDER BY UnitPrice
    `)
    return result[0]
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT
            COUNT(*) as "TotalOfCurrentProducts",
            (SELECT COUNT(*) FROM products WHERE Discontinued = 1) AS "TotalOfDiscontinuedProducts"
        FROM products
    `)
    return result[0]
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT
            ProductName as "ProductName",
            UnitsOnOrder as "UnitsOnOrder",
            UnitsInStock as "UnitsInStock"
        FROM products
        WHERE UnitsInStock < UnitsOnOrder
    `)
    return result[0]
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            SUM(MONTH(OrderDate) = 1 ) as "January",
            SUM(MONTH(OrderDate) = 2 ) as "February",
            SUM(MONTH(OrderDate) = 3 ) as "March",
            SUM(MONTH(OrderDate) = 4 ) as "April",
            SUM(MONTH(OrderDate) = 5 ) as "May",
            SUM(MONTH(OrderDate) = 6 ) as "June",
            SUM(MONTH(OrderDate) = 7 ) as "July",
            SUM(MONTH(OrderDate) = 8 ) as "August",
            SUM(MONTH(OrderDate) = 9 ) as "September",
            SUM(MONTH(OrderDate) = 10 ) as "October",
            SUM(MONTH(OrderDate) = 11 ) as "November",
            SUM(MONTH(OrderDate) = 12 ) as "December"
        FROM orders
        WHERE YEAR(OrderDate) = 1997
    `)
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT
            OrderID as "OrderID",
            CustomerID as "CustomerID",
            ShipCountry as "ShipCountry"
        FROM orders
        WHERE ShipPostalCode IS NOT NULL
    `)
    return result[0]
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT 
            cat.CategoryName AS "CategoryName",
            AVG(prod.UnitPrice) AS "AvgPrice"
        FROM categories cat
        JOIN products prod on prod.CategoryID = cat.CategoryID
        GROUP BY cat.CategoryID
        ORDER BY AVG(prod.UnitPrice) DESC, cat.CategoryName
    `)
    return result[0]
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
            SELECT 
                DATE_FORMAT(OrderDate, '%Y-%m-%d %T') as "OrderDate",
                Count(*) as "Total Number of Orders"
            FROM orders
            WHERE YEAR(OrderDate) = 1998
            GROUP BY OrderDate
    `)
    return result[0]
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        SELECT
            cus.CustomerID as "CustomerID",
            cus.CompanyName as "CompanyName",
            SUM(del.UnitPrice*del.Quantity) as "TotalOrdersAmount, $"
        FROM customers cus
        JOIN orders ord ON ord.CustomerID = cus.CustomerID
        JOIN orderdetails del ON del.OrderID = ord.OrderID
        GROUP BY cus.CustomerID
        HAVING SUM(del.UnitPrice*del.Quantity)>= 10000
        ORDER BY SUM(del.UnitPrice*del.Quantity) desc,cus.CustomerID
    `)
    return result[0]
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT
            empl.EmployeeID as "EmployeeID",
            CONCAT(empl.FirstName," ",empl.LastName) as "Employee Full Name",
            SUM(del.UnitPrice*del.Quantity) as "Amount, $"
        FROM employees empl
        JOIN orders ord ON ord.EmployeeID = empl.EmployeeID
        JOIN orderdetails del ON del.OrderID = ord.OrderID
        GROUP BY empl.EmployeeID
        ORDER BY SUM(del.UnitPrice*del.Quantity) desc
        LIMIT 1
    `)
    return result[0]
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT
            OrderID AS "OrderID",
            SUM(UnitPrice*Quantity) AS "Maximum Purchase Amount, $"
        FROM orderdetails
        group by OrderID
        ORDER BY SUM(UnitPrice*Quantity) DESC
        LIMIT 1
    `)
    return result[0]
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT
        cus.CompanyName as "CompanyName",
        (select ProductName from products where ProductID  =  (select d.productid from orderdetails d inner join orders ord on ord.OrderID = d.OrderID 
                    where d.unitprice = max(del.UnitPrice) and ord.CustomerID = cus.CustomerID
                    limit 1)) as "ProductName",
        max(del.UnitPrice) as PricePerItem
    FROM customers cus
    JOIN orders ord ON ord.CustomerID = cus.CustomerID
    JOIN orderdetails del ON del.OrderID = ord.OrderID
    JOIN products prod ON prod.ProductID = del.ProductID
    group by cus.CompanyName
    order by PricePerItem desc,cus.CompanyName,prod.ProductName
    `)
    return result[0]
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
